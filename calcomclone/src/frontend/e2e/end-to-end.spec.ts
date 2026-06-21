import { test, expect } from '@playwright/test'
import {
  resetIds,
  makeEventType,
  makeBooking,
  makeSlots,
  makeSettings,
} from './fixtures/data-factories'

const API_BASE = 'http://localhost:4010'

test.describe('End-to-End', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('full journey: admin creates event type, guest books, admin sees booking', async ({
    page,
  }) => {
    // --- Stateful data ---
    const eventTypes = [
      makeEventType({
        id: 'et-existing',
        name: 'Existing Type',
        description: 'Old',
        durationMinutes: 10,
      }),
    ]
    const bookings: ReturnType<typeof makeBooking>[] = []

    // --- Mock: GET /admin/event-types (list for admin) ---
    await page.route(
      (url) => url.origin === API_BASE && url.pathname === '/admin/event-types',
      async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(eventTypes),
          })
        } else if (route.request().method() === 'POST') {
          const body = route.request().postDataJSON() as {
            name: string
            description: string
            durationMinutes: number
          }
          const newEventType = makeEventType({
            name: body.name,
            description: body.description,
            durationMinutes: body.durationMinutes,
          })
          eventTypes.push(newEventType)
          await route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(newEventType),
          })
        } else {
          await route.fallback()
        }
      },
    )

    // --- Mock: GET /public/event-types (list for public page) ---
    await page.route(
      (url) => url.origin === API_BASE && url.pathname === '/public/event-types',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(eventTypes),
        })
      },
    )

    // --- Mock: GET /public/event-types/et-existing (single event type detail) ---
    await page.route(
      (url) =>
        url.origin === API_BASE &&
        url.pathname === '/public/event-types/et-existing',
      async (route) => {
        const et = eventTypes.find((e) => e.id === 'et-existing')
        await route.fulfill({
          status: et ? 200 : 404,
          contentType: 'application/json',
          body: JSON.stringify(et ?? {}),
        })
      },
    )

    // --- Mock: GET /public/event-types/et-existing/slots ---
    await page.route(
      (url) =>
        url.origin === API_BASE &&
        url.pathname === '/public/event-types/et-existing/slots',
      async (route) => {
        const slots = makeSlots(3, 1, 10, 0, 30)
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(slots),
        })
      },
    )

    // --- Mock: GET /admin/settings ---
    await page.route(
      (url) => url.origin === API_BASE && url.pathname === '/admin/settings',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(makeSettings()),
        })
      },
    )

    // --- Mock: POST /public/bookings ---
    await page.route(
      (url) => url.origin === API_BASE && url.pathname === '/public/bookings',
      async (route) => {
        if (route.request().method() !== 'POST') return route.fallback()
        const body = route.request().postDataJSON() as {
          eventTypeId: string
          startTime: string
          guest: { name: string }
        }
        const newBooking = makeBooking({
          eventTypeId: body.eventTypeId,
          startTime: body.startTime,
          guest: body.guest,
        })
        bookings.push(newBooking)
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newBooking),
        })
      },
    )

    // --- Mock: GET /admin/bookings ---
    await page.route(
      (url) => url.origin === API_BASE && url.pathname === '/admin/bookings',
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(bookings),
        })
      },
    )

    // ================================================================
    // STEP 1: Admin creates event type
    // ================================================================
    await page.goto('/admin/event-types')
    await expect(page.locator('h1')).toHaveText('Event Types')

    // Click "Create Event Type" button to open the dialog
    await page.getByRole('button', { name: 'Create Event Type' }).click()

    // Fill in the event type form
    await page.locator('#et-name').fill('Demo Call')
    await page.locator('#et-desc').fill('A demo call for testing')
    await page.locator('#et-duration').fill('30')

    // Click Save to create the event type
    await page.getByRole('button', { name: 'Save' }).click()

    // Wait for the dialog to close and verify the new type appears in the table
    await expect(page.getByRole('cell', { name: 'Demo Call' })).toBeVisible()

    // ================================================================
    // STEP 2: Guest navigates to booking page
    // ================================================================
    await page.goto('/')

    // Click Book on the pre-existing event type (first card)
    await page.getByRole('link', { name: 'Book' }).first().click()

    // Verify we are on the booking page for et-existing
    await expect(page).toHaveURL(/\/book\/et-existing/)

    // ================================================================
    // STEP 3: Guest selects slot, enters name, and books
    // ================================================================
    // Wait for the event type details to load
    await expect(page.locator('h1')).toHaveText('Existing Type')

    // Select the first available time slot button
    await page.getByRole('button', { name: '10:00' }).click()

    // Fill in the guest name
    await page.locator('#guest-name').fill('Alice')

    // Click Confirm Booking
    await page.getByRole('button', { name: 'Confirm Booking' }).click()

    // Verify booking confirmation message appears
    await expect(page.getByText('Booking confirmed!')).toBeVisible()

    // ================================================================
    // STEP 4: Admin sees the booking
    // ================================================================
    await page.goto('/admin/bookings')

    // Verify the bookings page shows Alice's booking
    await expect(page.locator('h1')).toHaveText('Bookings')
    await expect(page.getByRole('cell', { name: 'Alice' })).toBeVisible()
  })
})

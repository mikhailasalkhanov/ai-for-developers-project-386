import { test, expect } from '@playwright/test'
import { resetIds, makeEventType, makeBooking } from '../fixtures/data-factories'
import { setupAdminDashboard } from '../fixtures/mock-handlers'

test.describe('Admin Dashboard', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('displays dashboard with stat cards', async ({ page }) => {
    // 1. Mock 5 event types and 3 bookings
    const eventTypes = [
      makeEventType(),
      makeEventType(),
      makeEventType(),
      makeEventType(),
      makeEventType(),
    ]
    const bookings = [makeBooking(), makeBooking(), makeBooking()]
    await setupAdminDashboard(page, eventTypes, bookings)

    // 2. Navigate to /admin
    await page.goto('/admin')

    // 3. Verify heading
    await expect(page.locator('h1')).toHaveText('Admin Dashboard')

    // 4. Verify Event Types count shows 5
    await expect(page.getByText('5')).toBeVisible()

    // 5. Verify Upcoming Bookings count shows 3
    await expect(page.getByText('3')).toBeVisible()

    // 6. Verify Settings description
    await expect(page.getByText('Working hours & timezone')).toBeVisible()
  })

  test('clicking Event Types card navigates', async ({ page }) => {
    // 1. Mock event types and bookings
    const eventTypes = [makeEventType()]
    const bookings = [makeBooking()]
    await setupAdminDashboard(page, eventTypes, bookings)

    // 2. Navigate to /admin
    await page.goto('/admin')

    // 3. Click the Event Types card
    await page.locator('a[href="/admin/event-types"]').click()

    // 4. Verify URL navigated to event types page
    await expect(page).toHaveURL('/admin/event-types')
  })

  test('clicking Upcoming Bookings card navigates', async ({ page }) => {
    // 1. Mock event types and bookings
    const eventTypes = [makeEventType()]
    const bookings = [makeBooking()]
    await setupAdminDashboard(page, eventTypes, bookings)

    // 2. Navigate to /admin
    await page.goto('/admin')

    // 3. Click the Upcoming Bookings card
    await page.locator('a[href="/admin/bookings"]').click()

    // 4. Verify URL navigated to bookings page
    await expect(page).toHaveURL('/admin/bookings')
  })
})

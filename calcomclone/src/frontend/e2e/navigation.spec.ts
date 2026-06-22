import { test, expect } from '@playwright/test'
import { resetIds, makeEventType } from './fixtures/data-factories'
import {
  setupPublicEventTypes,
  setupAdminDashboard,
  setupAdminEventTypes,
  setupAdminBookings,
} from './fixtures/mock-handlers'

test.describe('Navigation', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('navigates from public home to admin via header', async ({ page }) => {
    // Mock public event types (empty) so the public page loads without API errors
    await setupPublicEventTypes(page, [])

    // Go to the public home page
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Available Event Types')

    // Mock admin dashboard endpoints before clicking the Admin link
    await setupAdminDashboard(page, [], [])

    // Click the Admin link in the header
    await page.getByRole('link', { name: 'Admin' }).click()

    // Assert we navigated to the admin dashboard
    await expect(page).toHaveURL('/admin')
    await expect(page.locator('h1')).toHaveText('Admin Dashboard')

    // Assert the header now shows "Public site" link
    await expect(page.getByRole('link', { name: 'Public site' })).toBeVisible()
  })

  test('navigates from admin to public via header', async ({ page }) => {
    // Mock admin event types so the admin event types page loads
    await setupAdminEventTypes(page, [])

    // Go to the admin event types page
    await page.goto('/admin/event-types')
    await expect(page.locator('h1')).toHaveText('Event Types')

    // Mock public event types before clicking the Public site link
    await setupPublicEventTypes(page, [])

    // Click the "Public site" link in the header
    await page.getByRole('link', { name: 'Public site' }).click()

    // Assert we navigated to the public home
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toHaveText('Available Event Types')
  })

  test('clicking logo navigates home from admin', async ({ page }) => {
    // Mock admin bookings so the admin bookings page loads
    await setupAdminBookings(page, [])

    // Go to the admin bookings page
    await page.goto('/admin/bookings')
    await expect(page.locator('h1')).toHaveText('Bookings')

    // Mock public event types before clicking the logo
    await setupPublicEventTypes(page, [])

    // Click the CalComClone logo in the header
    await page.getByRole('link', { name: 'CalComClone' }).click()

    // Assert we navigated home
    await expect(page).toHaveURL('/')
  })

  test('navigates from public event type card to booking page', async ({ page }) => {
    // Mock one event type on the public page
    const eventType = makeEventType({
      id: 'et-1',
      name: 'Test',
      description: 'desc',
      durationMinutes: 15,
    })
    await setupPublicEventTypes(page, [eventType])

    // Go to the public home page
    await page.goto('/')

    // Click the Book link on the event type card
    await page.getByRole('link', { name: 'Book' }).click()

    // Assert we navigated to the booking page
    await expect(page).toHaveURL(/\/book\/et-1/)
  })
})

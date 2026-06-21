import { test, expect } from '@playwright/test'
import { resetIds, makeBooking } from '../fixtures/data-factories'
import { setupAdminBookings, mockError } from '../fixtures/mock-handlers'

test.describe('Admin Bookings', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('displays bookings table with data', async ({ page }) => {
    const bookings = [
      makeBooking({ guest: { name: 'Jane Doe' }, eventTypeName: 'Quick Chat' }),
      makeBooking({ guest: { name: 'John Smith' }, eventTypeName: 'Consultation' }),
    ]
    await setupAdminBookings(page, bookings)

    await page.goto('/admin/bookings')

    await expect(page.getByRole('heading', { name: 'Bookings' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Jane Doe' })).toBeVisible()
    await expect(page.getByRole('cell', { name: 'Quick Chat' })).toBeVisible()
  })

  test('shows empty state', async ({ page }) => {
    await setupAdminBookings(page, [])

    await page.goto('/admin/bookings')

    await expect(page.getByText('No upcoming bookings.')).toBeVisible()
  })

  test('shows error state', async ({ page }) => {
    await mockError(page, 'GET', '/admin/bookings', 500, 'Server error')

    await page.goto('/admin/bookings')

    await expect(page.getByText('Server error')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'
import { resetIds, makeSlots, makeSettings } from '../fixtures/data-factories'
import { setupPublicBooking, mockPost, mockError, mockGet } from '../fixtures/mock-handlers'

test.describe('Public Booking', () => {
  const eventTypeId = 'et-1'
  const eventType = {
    id: eventTypeId,
    name: '30 Min Call',
    description: 'A half-hour chat',
    durationMinutes: 30,
  }
  const slots = makeSlots(4, 0, 10, 0, 30)
  const settings = makeSettings()

  test.beforeEach(() => {
    resetIds()
  })

  test('displays event type details and slots', async ({ page }) => {
    // Setup mocks for the public booking page
    await setupPublicBooking(page, eventTypeId, eventType, slots, settings)

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Assert: heading "30 Min Call" is visible
    await expect(page.getByRole('heading', { name: '30 Min Call' })).toBeVisible()

    // Assert: text "A half-hour chat" is visible
    await expect(page.getByText('A half-hour chat')).toBeVisible()

    // Assert: badge "30 min" is visible
    await expect(page.getByText('30 min', { exact: true })).toBeVisible()

    // Assert: calendar component is visible
    await expect(page.locator('.rounded-md.border').first()).toBeVisible()

    // Assert: heading "Confirm your booking" is visible
    await expect(page.getByRole('heading', { name: 'Confirm your booking' })).toBeVisible()
  })

  test('selects a time slot and enables booking form', async ({ page }) => {
    // Setup mocks for the public booking page
    await setupPublicBooking(page, eventTypeId, eventType, slots, settings)

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Assert: placeholder "Select a time slot above to book." is visible
    await expect(page.getByText('Select a time slot above to book.')).toBeVisible()

    // Click first time slot button that has text matching /\d{1,2}:\d{2}/
    const slotButton = page.getByRole('button', { name: /\d{1,2}:\d{2}/ }).first()
    await slotButton.click()

    // Assert: the selected date/time info appears in the .bg-muted.p-3 div (no placeholder)
    const slotInfo = page.locator('.bg-muted.p-3')
    await expect(slotInfo).not.toContainText('Select a time slot above to book.')

    // Assert: "Confirm Booking" button is disabled (no name entered yet)
    await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeDisabled()
  })

  test('books a meeting successfully', async ({ page }) => {
    // Setup mocks for the public booking page
    await setupPublicBooking(page, eventTypeId, eventType, slots, settings)

    // Mock POST booking response
    const firstSlot = slots[0]
    await mockPost(page, '/public/bookings', {
      id: 'bk-1',
      eventTypeId,
      eventTypeName: '30 Min Call',
      startTime: firstSlot!.startTime,
      endTime: firstSlot!.endTime,
      guest: { name: 'Test User' },
      createdAt: new Date().toISOString(),
    })

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Click first time slot button
    await page.getByRole('button', { name: /\d{1,2}:\d{2}/ }).first().click()

    // Fill guest name input
    await page.locator('#guest-name').fill('Test User')

    // Click "Confirm Booking"
    await page.getByRole('button', { name: 'Confirm Booking' }).click()

    // Assert: success banner "Booking confirmed!" is visible
    await expect(page.getByText('Booking confirmed!')).toBeVisible()

    // Assert: the form resets (slot info placeholder appears again)
    const slotInfo = page.locator('.bg-muted.p-3')
    await expect(slotInfo).toContainText('Select a time slot above to book.')
  })

  test('shows error when booking conflict', async ({ page }) => {
    // Setup mocks for the public booking page
    await setupPublicBooking(page, eventTypeId, eventType, slots, settings)

    // Mock POST conflict error
    await mockError(page, 'POST', '/public/bookings', 409, 'Slot is no longer available')

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Click first time slot button
    await page.getByRole('button', { name: /\d{1,2}:\d{2}/ }).first().click()

    // Fill guest name input
    await page.locator('#guest-name').fill('Test User')

    // Click "Confirm Booking"
    await page.getByRole('button', { name: 'Confirm Booking' }).click()

    // Assert: error message is visible
    await expect(page.getByText('Slot is no longer available')).toBeVisible()
  })

  test('Confirm Booking is disabled when no slot selected and name entered', async ({ page }) => {
    // Setup mocks for the public booking page
    await setupPublicBooking(page, eventTypeId, eventType, slots, settings)

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Fill guest name input without selecting a slot
    await page.locator('#guest-name').fill('Test User')

    // Assert: "Confirm Booking" button is disabled
    await expect(page.getByRole('button', { name: 'Confirm Booking' })).toBeDisabled()
  })

  test('shows event type load error', async ({ page }) => {
    // Mock event type GET error
    await mockError(page, 'GET', '/public/event-types/et-1', 404, 'Not found')

    // Mock slots and settings so those calls succeed
    await mockGet(page, '/public/event-types/et-1/slots', [])
    await mockGet(page, '/admin/settings', settings)

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Assert: error message is visible in the error div
    await expect(page.locator('.bg-destructive\\/10')).toContainText('Not found')
  })

  test('no slots message for a day without slots', async ({ page }) => {
    // Setup mocks with empty slots array
    await setupPublicBooking(page, eventTypeId, eventType, [], settings)

    // Navigate to the booking page
    await page.goto('/book/et-1')

    // Assert: calendar renders and "No available slots for this day." is visible
    await expect(page.locator('.rounded-md.border').first()).toBeVisible()
    await expect(page.getByText('No available slots for this day.')).toBeVisible()
  })
})

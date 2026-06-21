import { test, expect } from '@playwright/test'
import { resetIds, makeEventType } from '../fixtures/data-factories'
import { setupPublicEventTypes, mockError } from '../fixtures/mock-handlers'

test.describe('Public Event Types', () => {
  test.beforeEach(async () => {
    resetIds()
  })

  test('displays event types', async ({ page }) => {
    const eventTypes = [
      makeEventType({ name: 'Quick Chat' }),
      makeEventType({ name: 'Long Meeting' }),
      makeEventType({ name: 'Consultation' }),
    ]
    await setupPublicEventTypes(page, eventTypes)

    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Available Event Types' })).toBeVisible()
    await expect(page.getByText('Choose an event type to book a time slot.')).toBeVisible()

    const bookLinks = page.getByRole('link', { name: 'Book' })
    await expect(bookLinks).toHaveCount(3)

    await expect(page.getByText('Quick Chat')).toBeVisible()
    await expect(page.getByText('Long Meeting')).toBeVisible()
    await expect(page.getByText('Consultation')).toBeVisible()
  })

  test('shows empty state when no event types', async ({ page }) => {
    await setupPublicEventTypes(page, [])

    await page.goto('/')

    await expect(page.getByText('No event types available yet.')).toBeVisible()
  })

  test('shows error state when API fails', async ({ page }) => {
    await mockError(page, 'GET', '/public/event-types', 500, 'Server error')

    await page.goto('/')

    await expect(page.getByText('Server error')).toBeVisible()
  })

  test('navigates to booking page when clicking Book', async ({ page }) => {
    const eventType = makeEventType({ id: 'et-1' })
    await setupPublicEventTypes(page, [eventType])

    await page.goto('/')

    await page.getByRole('link', { name: 'Book' }).first().click()

    await expect(page).toHaveURL(/\/book\/et-1/)
  })
})

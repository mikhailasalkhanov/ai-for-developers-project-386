import { test, expect } from '@playwright/test'
import { resetIds, makeEventType } from '../fixtures/data-factories'
import { setupAdminEventTypes, mockPost, mockPatch, mockDelete } from '../fixtures/mock-handlers'

test.describe('Admin Event Types CRUD', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('displays empty state', async ({ page }) => {
    // 1. Mock empty event types array
    await setupAdminEventTypes(page, [])

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Verify empty state message
    await expect(page.getByText('No event types yet. Create your first one!')).toBeVisible()
  })

  test('create event type successfully', async ({ page }) => {
    // 1. Mock empty event types array
    await setupAdminEventTypes(page, [])
    // 2. Mock POST response for creating a new event type
    await mockPost(page, '/admin/event-types', {
      id: 'et-new',
      name: 'Strategy Call',
      description: 'Test',
      durationMinutes: 45,
    })

    // 3. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 4. Click Create Event Type button
    await page.getByRole('button', { name: 'Create Event Type' }).click()

    // 5. Fill in the form fields
    await page.locator('#et-name').fill('Strategy Call')
    await page.locator('#et-desc').fill('Test')
    await page.locator('#et-duration').fill('45')

    // 6. Click Save
    await page.getByRole('button', { name: 'Save' }).click()

    // 7. Verify the new event type appears in the table
    await expect(page.getByRole('cell', { name: 'Strategy Call' })).toBeVisible()
  })

  test('shows validation error when name is empty', async ({ page }) => {
    // 1. Mock empty event types array
    await setupAdminEventTypes(page, [])

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Click Create Event Type button
    await page.getByRole('button', { name: 'Create Event Type' }).click()

    // 4. Click Save without filling name
    await page.getByRole('button', { name: 'Save' }).click()

    // 5. Verify validation error is shown
    await expect(page.getByText('Name is required')).toBeVisible()
  })

  test('shows validation error when duration is invalid', async ({ page }) => {
    // 1. Mock empty event types array
    await setupAdminEventTypes(page, [])

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Click Create Event Type button
    await page.getByRole('button', { name: 'Create Event Type' }).click()

    // 4. Fill in name and set duration to 0
    await page.locator('#et-name').fill('Test')
    await page.locator('#et-duration').fill('0')

    // 5. Click Save
    await page.getByRole('button', { name: 'Save' }).click()

    // 6. Verify validation error is shown
    await expect(page.getByText('Duration must be greater than 0')).toBeVisible()
  })

  test('edit event type opens dialog with prefilled data', async ({ page }) => {
    // 1. Mock 1 event type
    const eventType = makeEventType()
    await setupAdminEventTypes(page, [eventType])

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Click Edit button on the row
    await page.getByRole('button', { name: 'Edit' }).click()

    // 4. Verify dialog title is Edit Event Type
    await expect(page.getByRole('heading', { name: 'Edit Event Type' })).toBeVisible()

    // 5. Verify name input is prefilled
    await expect(page.locator('#et-name')).toHaveValue('Quick Chat')
  })

  test('edit event type saves changes', async ({ page }) => {
    // 1. Mock 1 event type and the PATCH response
    await setupAdminEventTypes(page, [makeEventType()])
    await mockPatch(page, '/admin/event-types/et-1', {
      id: 'et-1',
      name: 'Updated Chat',
      description: 'New desc',
      durationMinutes: 30,
    })

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Click Edit button
    await page.getByRole('button', { name: 'Edit' }).click()

    // 4. Change the name
    await page.locator('#et-name').fill('Updated Chat')

    // 5. Click Save
    await page.getByRole('button', { name: 'Save' }).click()

    // 6. Verify the updated name appears in the table
    await expect(page.getByRole('cell', { name: 'Updated Chat' })).toBeVisible()
  })

  test('delete event type shows confirmation dialog', async ({ page }) => {
    // 1. Mock 1 event type
    const eventType = makeEventType()
    await setupAdminEventTypes(page, [eventType])

    // 2. Navigate to /admin/event-types
    await page.goto('/admin/event-types')

    // 3. Verify the event type is visible in the table
    await expect(page.getByRole('cell', { name: 'Quick Chat', exact: true })).toBeVisible()

    // 4. Click Delete button to open confirmation dialog
    await page.getByRole('button', { name: 'Delete' }).click()

    // 5. Verify dialog heading and description
    await expect(page.getByRole('heading', { name: 'Delete Event Type' })).toBeVisible()
    await expect(page.getByText('Are you sure')).toBeVisible()

    // 6. Click Cancel in the dialog
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click()

    // 7. Verify the event type is still visible (not deleted)
    await expect(page.getByRole('cell', { name: 'Quick Chat', exact: true })).toBeVisible()

    // 8. Click Delete again to reopen the dialog
    await page.getByRole('button', { name: 'Delete' }).click()

    // 9. Set up DELETE mock before confirming
    await mockDelete(page, '/admin/event-types/et-1')

    // 10. Click the destructive Delete button in the dialog to confirm
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()

    // 11. Verify empty state appears after deletion
    await expect(page.getByText('No event types yet. Create your first one!')).toBeVisible()
  })
})

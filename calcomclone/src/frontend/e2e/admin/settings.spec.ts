import { test, expect } from '@playwright/test'
import { resetIds, makeSettings } from '../fixtures/data-factories'
import { setupAdminSettings, mockPut, mockError } from '../fixtures/mock-handlers'

test.describe('Admin Settings', () => {
  test.beforeEach(() => {
    resetIds()
  })

  test('loads existing working hours', async ({ page }) => {
    await setupAdminSettings(page, makeSettings())

    await page.goto('/admin/settings')

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Working Hours' })).toBeVisible()
    await expect(page.locator('#day-monday')).toBeChecked()
    await expect(page.locator('#day-saturday')).not.toBeChecked()

    // Monday should have 4 time inputs (startH, startM, endH, endM)
    const mondayRow = page.locator('#day-monday').locator('..').locator('..')
    await expect(mondayRow.locator('input[type="number"]')).toHaveCount(4)

    // Saturday should have no time inputs
    const saturdayRow = page.locator('#day-saturday').locator('..').locator('..')
    await expect(saturdayRow.locator('input[type="number"]')).toHaveCount(0)
  })

  test('toggles a working day off and on', async ({ page }) => {
    await setupAdminSettings(page, makeSettings())

    await page.goto('/admin/settings')

    // Monday time inputs are visible
    let mondayRow = page.locator('#day-monday').locator('..').locator('..')
    await expect(mondayRow.locator('input[type="number"]')).toHaveCount(4)

    // Uncheck Monday
    await page.locator('#day-monday').uncheck()

    // Time inputs disappear
    mondayRow = page.locator('#day-monday').locator('..').locator('..')
    await expect(mondayRow.locator('input[type="number"]')).toHaveCount(0)

    // Re-check Monday
    await page.locator('#day-monday').check()

    // Time inputs reappear
    mondayRow = page.locator('#day-monday').locator('..').locator('..')
    await expect(mondayRow.locator('input[type="number"]')).toHaveCount(4)
  })

  test('saves settings', async ({ page }) => {
    const settings = makeSettings()
    await setupAdminSettings(page, settings)
    await mockPut(page, '/admin/settings', settings)

    await page.goto('/admin/settings')

    // Change Monday start hour to 8
    const mondayRow = page.locator('#day-monday').locator('..').locator('..')
    const firstInput = mondayRow.locator('input[type="number"]').first()
    await firstInput.fill('8')

    await page.getByRole('button', { name: 'Save Settings' }).click()

    // Should not show error (button text back to "Save Settings" after save)
    await expect(page.getByRole('button', { name: 'Save Settings' })).toBeVisible()
  })

  test('shows error on save failure', async ({ page }) => {
    await setupAdminSettings(page, makeSettings())
    await mockError(page, 'PUT', '/admin/settings', 500, 'Save failed')

    await page.goto('/admin/settings')

    await page.getByRole('button', { name: 'Save Settings' }).click()

    await expect(page.getByText('Save failed')).toBeVisible()
  })
})

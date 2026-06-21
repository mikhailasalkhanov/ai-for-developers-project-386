import type { Page } from '@playwright/test'

const API_BASE = 'http://localhost:4010'

function json(body: unknown, status = 200) {
  return {
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  }
}

interface MockConfig {
  method: string
  path: string | RegExp
  response?: unknown
  status?: number
}

export async function mockApi(page: Page, config: MockConfig): Promise<void> {
  await page.route(
    (url) => {
      if (url.origin !== API_BASE) return false
      return typeof config.path === 'string'
        ? url.pathname === config.path
        : config.path.test(url.pathname)
    },
    async (route) => {
      if (route.request().method() !== config.method) return route.fallback()
      if (config.response !== undefined) {
        await route.fulfill(json(config.response, config.status ?? 200))
      } else {
        await route.fulfill({ status: config.status ?? 204 })
      }
    },
  )
}

export async function mockGet(page: Page, path: string, body: unknown): Promise<void> {
  return mockApi(page, { method: 'GET', path, response: body })
}

export async function mockPost(
  page: Page,
  path: string,
  body: unknown,
  status = 201,
): Promise<void> {
  return mockApi(page, { method: 'POST', path, response: body, status })
}

export async function mockPatch(page: Page, path: string, body: unknown): Promise<void> {
  return mockApi(page, { method: 'PATCH', path, response: body })
}

export async function mockPut(page: Page, path: string, body: unknown): Promise<void> {
  return mockApi(page, { method: 'PUT', path, response: body })
}

export async function mockDelete(page: Page, path: string): Promise<void> {
  return mockApi(page, { method: 'DELETE', path })
}

export async function mockError(
  page: Page,
  method: string,
  path: string,
  code: number,
  message: string,
): Promise<void> {
  return mockApi(page, { method, path, response: { code, message }, status: code })
}

// Setup mocks for public event types page
export async function setupPublicEventTypes(
  page: Page,
  eventTypes: unknown[],
  delay = 0,
): Promise<void> {
  await page.route(`${API_BASE}/public/event-types`, async (route) => {
    if (delay) await new Promise((r) => setTimeout(r, delay))
    await route.fulfill(json(eventTypes))
  })
}

// Setup mocks for public booking page (event type + slots + settings)
export async function setupPublicBooking(
  page: Page,
  eventTypeId: string,
  eventType: unknown,
  slots: unknown[],
  settings: unknown,
): Promise<void> {
  await mockGet(page, `/public/event-types/${eventTypeId}`, eventType)
  await mockGet(page, `/public/event-types/${eventTypeId}/slots`, slots)
  await mockGet(page, '/admin/settings', settings)
}

// Setup mocks for admin dashboard
export async function setupAdminDashboard(
  page: Page,
  eventTypes: unknown[],
  bookings: unknown[],
): Promise<void> {
  await mockGet(page, '/admin/event-types', eventTypes)
  await mockGet(page, '/admin/bookings', bookings)
}

// Setup mocks for admin event types page
export async function setupAdminEventTypes(page: Page, eventTypes: unknown[]): Promise<void> {
  await mockGet(page, '/admin/event-types', eventTypes)
}

// Setup mocks for admin bookings page
export async function setupAdminBookings(page: Page, bookings: unknown[]): Promise<void> {
  await mockGet(page, '/admin/bookings', bookings)
}

// Setup mocks for admin settings page
export async function setupAdminSettings(page: Page, settings: unknown): Promise<void> {
  await mockGet(page, '/admin/settings', settings)
}

export { API_BASE }

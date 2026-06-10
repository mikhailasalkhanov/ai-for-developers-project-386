import type { OwnerSettings } from './types'
import { get, put } from './client'

export function getOwnerSettings(): Promise<OwnerSettings> {
  return get<OwnerSettings>('/admin/settings')
}

export function updateOwnerSettings(body: OwnerSettings): Promise<OwnerSettings> {
  return put<OwnerSettings>('/admin/settings', body)
}

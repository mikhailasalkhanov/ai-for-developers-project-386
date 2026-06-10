import type { Slot } from './types'
import { get } from './client'

export function listSlots(eventTypeId: string): Promise<Slot[]> {
  return get<Slot[]>(`/public/event-types/${eventTypeId}/slots`)
}

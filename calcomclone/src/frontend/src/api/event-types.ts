import type { EventType, EventTypeCreate, EventTypeUpdate } from './types'
import { get, post, patch, del } from './client'

export function listAdminEventTypes(): Promise<EventType[]> {
  return get<EventType[]>('/admin/event-types')
}

export function createEventType(body: EventTypeCreate): Promise<EventType> {
  return post<EventType>('/admin/event-types', body)
}

export function getAdminEventType(id: string): Promise<EventType> {
  return get<EventType>(`/admin/event-types/${id}`)
}

export function updateEventType(id: string, body: EventTypeUpdate): Promise<EventType> {
  return patch<EventType>(`/admin/event-types/${id}`, body)
}

export function deleteEventType(id: string): Promise<void> {
  return del<void>(`/admin/event-types/${id}`)
}

export function listPublicEventTypes(): Promise<EventType[]> {
  return get<EventType[]>('/public/event-types')
}

export function getPublicEventType(id: string): Promise<EventType> {
  return get<EventType>(`/public/event-types/${id}`)
}

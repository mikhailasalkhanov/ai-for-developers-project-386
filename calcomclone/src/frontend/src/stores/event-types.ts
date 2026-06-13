import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { EventType, EventTypeCreate, EventTypeUpdate } from '@/api/types'
import * as api from '@/api/event-types'

export const useEventTypeStore = defineStore('eventTypes', () => {
  const eventTypes = ref<EventType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAdmin() {
    loading.value = true
    error.value = null
    try {
      eventTypes.value = await api.listAdminEventTypes()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load event types'
    } finally {
      loading.value = false
    }
  }

  async function fetchPublic() {
    loading.value = true
    error.value = null
    try {
      eventTypes.value = await api.listPublicEventTypes()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load event types'
    } finally {
      loading.value = false
    }
  }

  async function create(data: EventTypeCreate): Promise<EventType | null> {
    loading.value = true
    error.value = null
    try {
      const created = await api.createEventType(data)
      eventTypes.value.push(created)
      return created
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create event type'
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, data: EventTypeUpdate): Promise<EventType | null> {
    loading.value = true
    error.value = null
    try {
      const updated = await api.updateEventType(id, data)
      const idx = eventTypes.value.findIndex((et) => et.id === id)
      if (idx !== -1) eventTypes.value[idx] = updated
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update event type'
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    try {
      await api.deleteEventType(id)
      eventTypes.value = eventTypes.value.filter((et) => et.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete event type'
      return false
    } finally {
      loading.value = false
    }
  }

  return { eventTypes, loading, error, fetchAdmin, fetchPublic, create, update, remove }
})

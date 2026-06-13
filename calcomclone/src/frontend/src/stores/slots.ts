import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Slot, Booking, BookingCreate } from '@/api/types'
import * as slotsApi from '@/api/slots'
import * as bookingsApi from '@/api/bookings'

export const useSlotStore = defineStore('slots', () => {
  const slots = ref<Slot[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(eventTypeId: string) {
    loading.value = true
    error.value = null
    try {
      slots.value = await slotsApi.listSlots(eventTypeId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load slots'
    } finally {
      loading.value = false
    }
  }

  async function createBooking(data: BookingCreate): Promise<Booking | null> {
    loading.value = true
    error.value = null
    try {
      return await bookingsApi.createBooking(data)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create booking'
      return null
    } finally {
      loading.value = false
    }
  }

  return { slots, loading, error, fetch, createBooking }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Booking } from '@/api/types'
import * as api from '@/api/bookings'

export const useBookingStore = defineStore('bookings', () => {
  const bookings = ref<Booking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch(from?: string, to?: string) {
    loading.value = true
    error.value = null
    try {
      bookings.value = await api.listAdminBookings(from, to)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load bookings'
    } finally {
      loading.value = false
    }
  }

  return { bookings, loading, error, fetch }
})

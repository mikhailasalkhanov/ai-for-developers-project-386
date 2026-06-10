import type { Booking, BookingCreate } from './types'
import { get, post } from './client'

export function listAdminBookings(from?: string, to?: string): Promise<Booking[]> {
  const params = new URLSearchParams()
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  const query = params.toString()
  return get<Booking[]>(`/admin/bookings${query ? `?${query}` : ''}`)
}

export function createBooking(body: BookingCreate): Promise<Booking> {
  return post<Booking>('/public/bookings', body)
}

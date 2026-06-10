export interface TimeOfDay {
  hour: number
  minute: number
}

export interface DaySchedule {
  isWorking: boolean
  start: TimeOfDay
  end: TimeOfDay
}

export interface OwnerSettings {
  timezone: string
  workingHours: {
    monday: DaySchedule
    tuesday: DaySchedule
    wednesday: DaySchedule
    thursday: DaySchedule
    friday: DaySchedule
    saturday: DaySchedule
    sunday: DaySchedule
  }
}

export interface EventType {
  id: string
  name: string
  description: string
  durationMinutes: number
}

export interface EventTypeCreate {
  name: string
  description: string
  durationMinutes: number
}

export interface EventTypeUpdate {
  name?: string
  description?: string
  durationMinutes?: number
}

export interface Slot {
  startTime: string
  endTime: string
}

export interface GuestInfo {
  name: string
}

export interface Booking {
  id: string
  eventTypeId: string
  eventTypeName: string
  startTime: string
  endTime: string
  guest: GuestInfo
  createdAt: string
}

export interface BookingCreate {
  eventTypeId: string
  startTime: string
  guest: GuestInfo
}

export interface ApiError {
  code: number
  message: string
}

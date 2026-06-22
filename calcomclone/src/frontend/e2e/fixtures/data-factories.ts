let idCounter = 0

export function uid(prefix: string): string {
  return `${prefix}-${++idCounter}`
}

export function resetIds(): void {
  idCounter = 0
}

const now = new Date()

function futureDate(daysAhead: number, hour: number, minute = 0): string {
  const d = new Date(now)
  d.setDate(d.getDate() + daysAhead)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function endDate(start: string, durationMinutes: number): string {
  const d = new Date(start)
  d.setMinutes(d.getMinutes() + durationMinutes)
  return d.toISOString()
}

// ---------- TimeOfDay ----------
export interface TimeOfDay {
  hour: number
  minute: number
}

// ---------- DaySchedule ----------
export interface DaySchedule {
  isWorking: boolean
  start: TimeOfDay
  end: TimeOfDay
}

// ---------- EventType ----------
export interface EventType {
  id: string
  name: string
  description: string
  durationMinutes: number
}

// ---------- Slot ----------
export interface Slot {
  startTime: string
  endTime: string
}

// ---------- GuestInfo ----------
export interface GuestInfo {
  name: string
}

// ---------- Booking ----------
export interface Booking {
  id: string
  eventTypeId: string
  eventTypeName: string
  startTime: string
  endTime: string
  guest: GuestInfo
  createdAt: string
}

// ---------- BookingCreate ----------
export interface BookingCreate {
  eventTypeId: string
  startTime: string
  guest: GuestInfo
}

// ---------- OwnerSettings ----------
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

// ---------- ApiError ----------
export interface ApiError {
  code: number
  message: string
}

// ---------- Factory functions ----------

export function makeEventType(overrides?: Partial<EventType>): EventType {
  return {
    id: uid('et'),
    name: 'Quick Chat',
    description: 'A 15-minute quick chat',
    durationMinutes: 15,
    ...overrides,
  }
}

export function makeSlot(overrides?: Partial<Slot>): Slot {
  const start = overrides?.startTime ?? futureDate(1, 10, 0)
  return { startTime: start, endTime: endDate(start, 30), ...overrides }
}

export function makeSlots(
  count: number,
  startDay: number,
  hour: number,
  minute: number,
  stepMinutes: number,
): Slot[] {
  const slots: Slot[] = []
  for (let i = 0; i < count; i++) {
    const start = futureDate(startDay, hour, minute + i * stepMinutes)
    slots.push({ startTime: start, endTime: endDate(start, 30) })
  }
  return slots
}

export function makeBooking(overrides?: Partial<Booking>): Booking {
  const eventTypeId = overrides?.eventTypeId ?? uid('et')
  return {
    id: uid('bk'),
    eventTypeId,
    eventTypeName: 'Quick Chat',
    startTime: futureDate(2, 14, 0),
    endTime: futureDate(2, 14, 30),
    createdAt: new Date().toISOString(),
    ...overrides,
    guest: { name: 'Jane Doe', ...overrides?.guest },
  }
}

function makeDay(isWorking: boolean, startH: number, endH: number): DaySchedule {
  return {
    isWorking,
    start: { hour: startH, minute: 0 },
    end: { hour: endH, minute: 0 },
  }
}

export function makeSettings(overrides?: Partial<OwnerSettings>): OwnerSettings {
  return {
    timezone: 'America/New_York',
    workingHours: {
      monday: makeDay(true, 9, 17),
      tuesday: makeDay(true, 9, 17),
      wednesday: makeDay(true, 9, 17),
      thursday: makeDay(true, 9, 17),
      friday: makeDay(true, 9, 17),
      saturday: makeDay(false, 0, 0),
      sunday: makeDay(false, 0, 0),
    },
    ...overrides,
  }
}

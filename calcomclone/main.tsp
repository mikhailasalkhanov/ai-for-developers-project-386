import "@typespec/http";

using Http;

@service(#{ title: "Calendar Booking Service" })
namespace CalendarBooking;

// ---------- Common ----------

@error
model ApiError {
  code: int32;
  message: string;
}

// ---------- Owner Settings ----------

model TimeOfDay {
  @minValue(0) @maxValue(23) hour: int32;
  @minValue(0) @maxValue(59) minute: int32;
}

model DaySchedule {
  isWorking: boolean;
  start: TimeOfDay;
  end: TimeOfDay;
}

model OwnerSettings {
  timezone: string;
  workingHours: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
    sunday: DaySchedule;
  };
}

// ---------- Event Type ----------

model EventType {
  @format("uuid") id: string;
  name: string;
  description: string;
  @minValue(1) @maxValue(1440) durationMinutes: int32;
}

model EventTypeCreate {
  name: string;
  description: string;
  @minValue(1) @maxValue(1440) durationMinutes: int32;
}

model EventTypeUpdate {
  name?: string;
  description?: string;
  @minValue(1) @maxValue(1440) durationMinutes?: int32;
}

// ---------- Slot ----------

model Slot {
  startTime: utcDateTime;
  endTime: utcDateTime;
}

// ---------- Guest & Booking ----------

model GuestInfo {
  name: string;
}

model Booking {
  @format("uuid") id: string;
  @format("uuid") eventTypeId: string;
  eventTypeName: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  guest: GuestInfo;
  createdAt: utcDateTime;
}

model BookingCreate {
  eventTypeId: string;
  startTime: utcDateTime;
  guest: GuestInfo;
}

// ---------- Admin (Owner) ----------

@route("/admin/settings")
@tag("Admin: Settings")
interface OwnerSettingsAdmin {
  @get get(): OwnerSettings | ApiError;
  @put update(@body body: OwnerSettings): OwnerSettings | ApiError;
}

@route("/admin/event-types")
@tag("Admin: Event Types")
interface EventTypesAdmin {
  @get list(): EventType[] | ApiError;
  @post create(@body body: EventTypeCreate): {
    @statusCode _: 201;
    @body body: EventType;
  } | ApiError;
  @get read(@path id: string): EventType | ApiError;
  @patch update(@path id: string, @body body: EventTypeUpdate): EventType | ApiError;
  @delete delete(@path id: string): void | ApiError;
}

@route("/admin/bookings")
@tag("Admin: Bookings")
interface BookingsAdmin {
  @get list(
    @query from?: utcDateTime,
    @query to?: utcDateTime
  ): Booking[] | ApiError;
}

// ---------- Public (Guest) ----------

@route("/public/event-types")
@tag("Public: Event Types")
interface EventTypesPublic {
  @get list(): EventType[] | ApiError;
  @get read(@path id: string): EventType | ApiError;
}

@route("/public/event-types/{id}/slots")
@tag("Public: Slots")
interface SlotsPublic {
  @get list(@path id: string): Slot[] | ApiError;
}

@route("/public/bookings")
@tag("Public: Bookings")
interface BookingsPublic {
  @post create(@body body: BookingCreate): {
    @statusCode _: 201;
    @body body: Booking;
  } | ApiError;
}

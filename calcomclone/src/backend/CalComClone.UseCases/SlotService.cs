using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.UseCases;

public class SlotService : ISlotService
{
    private readonly IEventTypeRepository _eventTypeRepository;
    private readonly IOwnerSettingsRepository _ownerSettingsRepository;
    private readonly IBookingRepository _bookingRepository;
    private const int LookAheadDays = 14;

    public SlotService(
        IEventTypeRepository eventTypeRepository,
        IOwnerSettingsRepository ownerSettingsRepository,
        IBookingRepository bookingRepository)
    {
        _eventTypeRepository = eventTypeRepository;
        _ownerSettingsRepository = ownerSettingsRepository;
        _bookingRepository = bookingRepository;
    }

    public async Task<IReadOnlyList<Slot>> GetAvailableSlotsAsync(Guid eventTypeId)
    {
        var eventType = await _eventTypeRepository.GetByIdAsync(eventTypeId);
        if (eventType is null)
            return Array.Empty<Slot>();

        var settings = await _ownerSettingsRepository.GetAsync();
        var today = DateTime.UtcNow.Date;
        var endDate = today.AddDays(LookAheadDays);

        var bookings = await _bookingRepository.ListAsync(today, endDate.AddDays(1));

        var slots = new List<Slot>();
        for (var date = today; date < endDate; date = date.AddDays(1))
        {
            if (settings is null)
                continue;

            var schedule = settings.WorkingHours.GetDaySchedule(date.DayOfWeek);
            if (schedule is null || !schedule.IsWorking)
                continue;

            var dayStart = date.AddHours(schedule.Start.Hour).AddMinutes(schedule.Start.Minute);
            var dayEnd = date.AddHours(schedule.End.Hour).AddMinutes(schedule.End.Minute);

            for (var slotStart = dayStart; slotStart.AddMinutes(eventType.DurationMinutes) <= dayEnd; slotStart = slotStart.AddMinutes(eventType.DurationMinutes))
            {
                var slotEnd = slotStart.AddMinutes(eventType.DurationMinutes);

                var overlaps = bookings.Any(b =>
                    b.StartTime < slotEnd && b.EndTime > slotStart);

                if (!overlaps)
                {
                    slots.Add(new Slot { StartTime = slotStart, EndTime = slotEnd });
                }
            }
        }

        return slots;
    }
}

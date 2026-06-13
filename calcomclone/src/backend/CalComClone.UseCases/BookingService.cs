using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.UseCases;

public class BookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IEventTypeRepository _eventTypeRepository;

    public BookingService(IBookingRepository bookingRepository, IEventTypeRepository eventTypeRepository)
    {
        _bookingRepository = bookingRepository;
        _eventTypeRepository = eventTypeRepository;
    }

    public async Task<IReadOnlyList<Booking>> ListAsync(DateTime? from, DateTime? to)
    {
        return await _bookingRepository.ListAsync(from, to);
    }

    public async Task<Booking?> CreateAsync(Guid eventTypeId, DateTime startTime, string guestName)
    {
        var eventType = await _eventTypeRepository.GetByIdAsync(eventTypeId);
        if (eventType is null)
            return null;

        var booking = new Booking
        {
            EventTypeId = eventType.Id,
            EventTypeName = eventType.Name,
            StartTime = startTime,
            EndTime = startTime.AddMinutes(eventType.DurationMinutes),
            Guest = new GuestInfo { Name = guestName }
        };

        return await _bookingRepository.CreateAsync(booking);
    }
}

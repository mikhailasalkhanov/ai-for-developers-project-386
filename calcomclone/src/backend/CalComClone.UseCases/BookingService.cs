using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;
using CalComClone.UseCases.BookingCreateService;
using FluentValidation;

namespace CalComClone.UseCases;

public class BookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly IEventTypeRepository _eventTypeRepository;
    private readonly IOwnerSettingsRepository _ownerSettingsRepository;
    private readonly IValidator<CreateBookingInput> _createBookingValidator;

    public BookingService(
        IBookingRepository bookingRepository,
        IEventTypeRepository eventTypeRepository,
        IOwnerSettingsRepository ownerSettingsRepository,
        IValidator<CreateBookingInput> createBookingValidator)
    {
        _bookingRepository = bookingRepository;
        _eventTypeRepository = eventTypeRepository;
        _ownerSettingsRepository = ownerSettingsRepository;
        _createBookingValidator = createBookingValidator;
    }

    public async Task<IReadOnlyList<Booking>> ListAsync(DateTime? from, DateTime? to)
    {
        return await _bookingRepository.ListAsync(from, to);
    }

    public async Task<Booking?> CreateAsync(Guid eventTypeId, DateTime startTime, string guestName)
    {
        var eventType = await _eventTypeRepository.GetByIdAsync(eventTypeId);
        var ownerSettings = await _ownerSettingsRepository.GetAsync();
        var existingBookings = await _bookingRepository.ListAsync(
            startTime.Date,
            startTime.Date.AddDays(1));

        var input = new CreateBookingInput
        {
            EventTypeId = eventTypeId,
            StartTime = startTime,
            GuestName = guestName,
            EventType = eventType,
            ExistingBookings = existingBookings,
            OwnerSettings = ownerSettings
        };

        await _createBookingValidator.ValidateAndThrowAsync(input);

        var booking = new Booking
        {
            EventTypeId = eventType!.Id,
            EventTypeName = eventType.Name,
            StartTime = startTime,
            EndTime = startTime.AddMinutes(eventType.DurationMinutes),
            Guest = new GuestInfo { Name = guestName }
        };

        return await _bookingRepository.CreateAsync(booking);
    }
}

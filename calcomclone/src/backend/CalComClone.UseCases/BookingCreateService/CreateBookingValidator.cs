using CalComClone.Core.Models;
using FluentValidation;

namespace CalComClone.UseCases.BookingCreateService;

public class CreateBookingValidator : AbstractValidator<CreateBookingInput>
{
    public CreateBookingValidator()
    {
        RuleFor(x => x.EventType)
            .NotNull()
            .WithMessage("Event type not found.");

        RuleFor(x => x.ExistingBookings)
            .Must((input, bookings) => !HasOverlap(input, bookings))
            .WithMessage("The selected time slot is already booked.")
            .When(x => x.EventType is not null);

        RuleFor(x => x.StartTime)
            .Must((input, startTime) => IsWithinWorkingHours(input, startTime))
            .WithMessage("The selected time is outside working hours.")
            .When(x => x.EventType is not null);
    }

    private static bool HasOverlap(CreateBookingInput input, IReadOnlyList<Booking> bookings)
    {
        var slotEnd = input.StartTime.AddMinutes(input.EventType!.DurationMinutes);
        return bookings.Any(b => b.StartTime < slotEnd && b.EndTime > input.StartTime);
    }

    private static bool IsWithinWorkingHours(CreateBookingInput input, DateTime startTime)
    {
        if (input.OwnerSettings is null)
            return false;

        var schedule = input.OwnerSettings.WorkingHours.GetDaySchedule(startTime.DayOfWeek);
        if (schedule is null || !schedule.IsWorking)
            return false;

        var dayStartMinutes = schedule.Start.Hour * 60 + schedule.Start.Minute;
        var dayEndMinutes = schedule.End.Hour * 60 + schedule.End.Minute;
        var slotMinutes = startTime.Hour * 60 + startTime.Minute;
        var slotEndMinutes = slotMinutes + input.EventType!.DurationMinutes;

        return slotMinutes >= dayStartMinutes && slotEndMinutes <= dayEndMinutes;
    }
}

using FluentValidation;

namespace CalComClone.Requests.BookingCreate;

public class BookingCreateRequestValidator : AbstractValidator<BookingCreateRequest>
{
    public BookingCreateRequestValidator()
    {
        RuleFor(x => x.EventTypeId).NotEmpty();
        RuleFor(x => x.GuestName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.StartTime)
            .NotEqual(default(DateTime))
            .Must(startTime => startTime > DateTime.UtcNow)
            .WithMessage("Start time must be in the future.")
            .Must(startTime => startTime.Kind == DateTimeKind.Utc)
            .WithMessage("Start time must be in UTC.");
    }
}

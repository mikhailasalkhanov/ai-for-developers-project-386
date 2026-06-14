using FluentValidation;

namespace CalComClone.Requests.EventTypeUpdate;

public class EventTypeUpdateRequestValidator : AbstractValidator<EventTypeUpdateRequest>
{
    public EventTypeUpdateRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200)
            .When(x => x.Name is not null);

        RuleFor(x => x.DurationMinutes)
            .InclusiveBetween(1, 1440)
            .When(x => x.DurationMinutes.HasValue);
    }
}

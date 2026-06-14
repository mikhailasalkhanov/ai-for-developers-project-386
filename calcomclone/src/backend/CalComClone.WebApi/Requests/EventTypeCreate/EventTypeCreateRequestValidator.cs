using FluentValidation;

namespace CalComClone.Requests.EventTypeCreate;

public class EventTypeCreateRequestValidator : AbstractValidator<EventTypeCreateRequest>
{
    public EventTypeCreateRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DurationMinutes).InclusiveBetween(1, 1440);
    }
}

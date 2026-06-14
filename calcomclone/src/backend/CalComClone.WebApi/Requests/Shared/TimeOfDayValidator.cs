using CalComClone.Core.Models;
using FluentValidation;

namespace CalComClone.Requests.Shared;

public class TimeOfDayValidator : AbstractValidator<TimeOfDay>
{
    public TimeOfDayValidator()
    {
        RuleFor(x => x.Hour).InclusiveBetween(0, 23);
        RuleFor(x => x.Minute).InclusiveBetween(0, 59);
    }
}

using CalComClone.Core.Models;
using FluentValidation;

namespace CalComClone.Requests.Shared;

public class DayScheduleValidator : AbstractValidator<DaySchedule>
{
    public DayScheduleValidator()
    {
        RuleFor(x => x.Start).SetValidator(new TimeOfDayValidator());
        RuleFor(x => x.End).SetValidator(new TimeOfDayValidator());
    }
}

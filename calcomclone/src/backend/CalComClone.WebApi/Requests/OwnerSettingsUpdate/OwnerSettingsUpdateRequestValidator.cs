using CalComClone.Requests.Shared;
using FluentValidation;

namespace CalComClone.Requests.OwnerSettingsUpdate;

public class OwnerSettingsUpdateRequestValidator : AbstractValidator<OwnerSettingsUpdateRequest>
{
    public OwnerSettingsUpdateRequestValidator()
    {
        RuleFor(x => x.Timezone).NotEmpty();

        RuleFor(x => x.Monday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Tuesday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Wednesday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Thursday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Friday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Saturday).SetValidator(new DayScheduleValidator());
        RuleFor(x => x.Sunday).SetValidator(new DayScheduleValidator());
    }
}

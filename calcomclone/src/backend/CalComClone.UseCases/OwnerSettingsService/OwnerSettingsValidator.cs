using CalComClone.Core.Models;
using FluentValidation;

namespace CalComClone.UseCases.OwnerSettingsService;

public class OwnerSettingsValidator : AbstractValidator<OwnerSettings>
{
    public OwnerSettingsValidator()
    {
        RuleFor(x => x.Timezone).NotEmpty();

        RuleFor(x => x.Monday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Tuesday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Wednesday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Thursday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Friday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Saturday).SetValidator(new DayScheduleBusinessValidator());
        RuleFor(x => x.Sunday).SetValidator(new DayScheduleBusinessValidator());
    }
}

internal class DayScheduleBusinessValidator : AbstractValidator<DaySchedule>
{
    public DayScheduleBusinessValidator()
    {
        RuleFor(x => x.End)
            .Must((schedule, end) =>
                !schedule.IsWorking || (schedule.Start.Hour * 60 + schedule.Start.Minute) < (end.Hour * 60 + end.Minute))
            .WithMessage("End time must be after start time on working days.");
    }
}

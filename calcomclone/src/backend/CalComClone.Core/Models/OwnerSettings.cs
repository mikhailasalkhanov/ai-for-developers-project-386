namespace CalComClone.Core.Models;

public class OwnerSettings
{
    public string Timezone { get; set; } = "UTC";
    public DaySchedule Monday { get; set; } = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } };
    public DaySchedule Tuesday { get; set; } = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } };
    public DaySchedule Wednesday { get; set; } = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } };
    public DaySchedule Thursday { get; set; } = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } };
    public DaySchedule Friday { get; set; } = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } };
    public DaySchedule Saturday { get; set; } = new() { IsWorking = false, Start = new() { Hour = 0, Minute = 0 }, End = new() { Hour = 0, Minute = 0 } };
    public DaySchedule Sunday { get; set; } = new() { IsWorking = false, Start = new() { Hour = 0, Minute = 0 }, End = new() { Hour = 0, Minute = 0 } };

    public DaySchedule? GetDaySchedule(DayOfWeek day) => day switch
    {
        DayOfWeek.Monday => Monday,
        DayOfWeek.Tuesday => Tuesday,
        DayOfWeek.Wednesday => Wednesday,
        DayOfWeek.Thursday => Thursday,
        DayOfWeek.Friday => Friday,
        DayOfWeek.Saturday => Saturday,
        DayOfWeek.Sunday => Sunday,
        _ => null
    };
}

namespace CalComClone.Core.Models;

public class OwnerSettings
{
    public string Timezone { get; set; } = "UTC";
    public Dictionary<DayOfWeek, DaySchedule> WorkingHours { get; set; } = new()
    {
        [DayOfWeek.Monday] = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } },
        [DayOfWeek.Tuesday] = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } },
        [DayOfWeek.Wednesday] = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } },
        [DayOfWeek.Thursday] = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } },
        [DayOfWeek.Friday] = new() { IsWorking = true, Start = new() { Hour = 9, Minute = 0 }, End = new() { Hour = 17, Minute = 0 } },
        [DayOfWeek.Saturday] = new() { IsWorking = false, Start = new() { Hour = 0, Minute = 0 }, End = new() { Hour = 0, Minute = 0 } },
        [DayOfWeek.Sunday] = new() { IsWorking = false, Start = new() { Hour = 0, Minute = 0 }, End = new() { Hour = 0, Minute = 0 } },
    };
}

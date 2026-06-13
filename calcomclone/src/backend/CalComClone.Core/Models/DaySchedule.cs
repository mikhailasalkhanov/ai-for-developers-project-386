namespace CalComClone.Core.Models;

public class DaySchedule
{
    public bool IsWorking { get; set; }
    public TimeOfDay Start { get; set; } = new();
    public TimeOfDay End { get; set; } = new();
}

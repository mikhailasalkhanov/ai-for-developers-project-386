using CalComClone.Core.Models;

namespace CalComClone.Requests.OwnerSettingsUpdate;

public class OwnerSettingsUpdateRequest
{
    public string Timezone { get; set; } = "UTC";
    public DaySchedule Monday { get; set; } = new();
    public DaySchedule Tuesday { get; set; } = new();
    public DaySchedule Wednesday { get; set; } = new();
    public DaySchedule Thursday { get; set; } = new();
    public DaySchedule Friday { get; set; } = new();
    public DaySchedule Saturday { get; set; } = new();
    public DaySchedule Sunday { get; set; } = new();
}

namespace CalComClone.Core.Models;

public class OwnerSettings
{
    public string Timezone { get; set; } = "UTC";
    public WorkingHours WorkingHours { get; set; } = new();
}

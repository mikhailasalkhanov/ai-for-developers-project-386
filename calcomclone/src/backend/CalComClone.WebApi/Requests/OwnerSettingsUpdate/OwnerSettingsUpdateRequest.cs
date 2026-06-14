using CalComClone.Core.Models;

namespace CalComClone.Requests.OwnerSettingsUpdate;

public class OwnerSettingsUpdateRequest
{
    public string Timezone { get; set; } = "UTC";
    public WorkingHours WorkingHours { get; set; } = new();
}

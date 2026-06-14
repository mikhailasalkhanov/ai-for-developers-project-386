namespace CalComClone.Requests.EventTypeCreate;

public class EventTypeCreateRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
}

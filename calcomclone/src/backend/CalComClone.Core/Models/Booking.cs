namespace CalComClone.Core.Models;

public class Booking
{
    public Guid Id { get; set; }
    public Guid EventTypeId { get; set; }
    public string EventTypeName { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public GuestInfo Guest { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

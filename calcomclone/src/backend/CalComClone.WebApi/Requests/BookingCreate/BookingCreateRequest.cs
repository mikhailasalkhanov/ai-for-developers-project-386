using CalComClone.Core.Models;

namespace CalComClone.Requests.BookingCreate;

public class BookingCreateRequest
{
    public Guid EventTypeId { get; set; }
    public DateTime StartTime { get; set; }
    public GuestInfo Guest { get; set; } = new();
}

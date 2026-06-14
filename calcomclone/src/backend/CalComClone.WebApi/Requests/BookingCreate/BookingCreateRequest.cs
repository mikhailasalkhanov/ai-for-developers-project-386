namespace CalComClone.Requests.BookingCreate;

public class BookingCreateRequest
{
    public Guid EventTypeId { get; set; }
    public DateTime StartTime { get; set; }
    public string GuestName { get; set; } = string.Empty;
}

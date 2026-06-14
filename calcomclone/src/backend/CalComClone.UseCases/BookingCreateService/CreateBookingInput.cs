using CalComClone.Core.Models;

namespace CalComClone.UseCases.BookingCreateService;

public class CreateBookingInput
{
    public Guid EventTypeId { get; set; }
    public DateTime StartTime { get; set; }
    public string GuestName { get; set; } = string.Empty;
    public EventType? EventType { get; set; }
    public IReadOnlyList<Booking> ExistingBookings { get; set; } = Array.Empty<Booking>();
    public Core.Models.OwnerSettings? OwnerSettings { get; set; }
}

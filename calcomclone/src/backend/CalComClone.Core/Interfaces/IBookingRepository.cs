using CalComClone.Core.Models;

namespace CalComClone.Core.Interfaces;

public interface IBookingRepository
{
    Task<IReadOnlyList<Booking>> ListAsync(DateTime? from, DateTime? to);
    Task<Booking> CreateAsync(Booking booking);
}

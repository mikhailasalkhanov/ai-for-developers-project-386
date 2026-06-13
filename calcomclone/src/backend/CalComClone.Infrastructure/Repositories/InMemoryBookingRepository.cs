using System.Collections.Concurrent;
using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.Infrastructure.Repositories;

public class InMemoryBookingRepository : IBookingRepository
{
    private readonly ConcurrentBag<Booking> _store = new();

    public Task<IReadOnlyList<Booking>> ListAsync(DateTime? from, DateTime? to)
    {
        var query = _store.AsEnumerable();
        if (from.HasValue)
            query = query.Where(b => b.StartTime >= from.Value);
        if (to.HasValue)
            query = query.Where(b => b.StartTime <= to.Value);
        return Task.FromResult<IReadOnlyList<Booking>>(query.OrderBy(b => b.StartTime).ToList());
    }

    public Task<Booking> CreateAsync(Booking booking)
    {
        booking.Id = Guid.NewGuid();
        booking.CreatedAt = DateTime.UtcNow;
        _store.Add(booking);
        return Task.FromResult(booking);
    }
}

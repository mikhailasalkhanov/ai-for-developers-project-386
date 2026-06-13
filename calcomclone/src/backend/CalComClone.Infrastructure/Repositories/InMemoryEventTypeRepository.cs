using System.Collections.Concurrent;
using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.Infrastructure.Repositories;

public class InMemoryEventTypeRepository : IEventTypeRepository
{
    private readonly ConcurrentDictionary<Guid, EventType> _store = new();
    private readonly ConcurrentQueue<Guid> _order = new();

    public InMemoryEventTypeRepository()
    {
        Seed();
    }

    public Task<IReadOnlyList<EventType>> ListAsync()
    {
        var list = _order.Select(id => _store[id]).ToList();
        return Task.FromResult<IReadOnlyList<EventType>>(list);
    }

    public Task<EventType?> GetByIdAsync(Guid id)
    {
        _store.TryGetValue(id, out var eventType);
        return Task.FromResult(eventType);
    }

    public Task<EventType> CreateAsync(EventType eventType)
    {
        eventType.Id = Guid.NewGuid();
        _store[eventType.Id] = eventType;
        _order.Enqueue(eventType.Id);
        return Task.FromResult(eventType);
    }

    public Task<EventType?> UpdateAsync(EventType eventType)
    {
        if (!_store.ContainsKey(eventType.Id))
            return Task.FromResult<EventType?>(null);
        _store[eventType.Id] = eventType;
        return Task.FromResult<EventType?>(eventType);
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return Task.FromResult(_store.TryRemove(id, out _));
    }

    private void Seed()
    {
        var seed = new[]
        {
            new EventType { Id = Guid.NewGuid(), Name = "30 Minute Meeting", Description = "Quick sync-up call", DurationMinutes = 30 },
            new EventType { Id = Guid.NewGuid(), Name = "1 Hour Consultation", Description = "In-depth discussion", DurationMinutes = 60 },
            new EventType { Id = Guid.NewGuid(), Name = "15 Minute Check-in", Description = "Brief status update", DurationMinutes = 15 },
        };
        foreach (var et in seed)
        {
            _store[et.Id] = et;
            _order.Enqueue(et.Id);
        }
    }
}

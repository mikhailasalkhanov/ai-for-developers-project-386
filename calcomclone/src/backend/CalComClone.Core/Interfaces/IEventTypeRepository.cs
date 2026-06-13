using CalComClone.Core.Models;

namespace CalComClone.Core.Interfaces;

public interface IEventTypeRepository
{
    Task<IReadOnlyList<EventType>> ListAsync();
    Task<EventType?> GetByIdAsync(Guid id);
    Task<EventType> CreateAsync(EventType eventType);
    Task<EventType?> UpdateAsync(EventType eventType);
    Task<bool> DeleteAsync(Guid id);
}

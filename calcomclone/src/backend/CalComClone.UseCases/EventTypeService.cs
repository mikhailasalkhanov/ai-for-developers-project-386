using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.UseCases;

public class EventTypeService
{
    private readonly IEventTypeRepository _repository;

    public EventTypeService(IEventTypeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<EventType>> ListAsync()
    {
        return await _repository.ListAsync();
    }

    public async Task<EventType?> GetByIdAsync(Guid id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<EventType> CreateAsync(string name, string description, int durationMinutes)
    {
        var eventType = new EventType
        {
            Name = name,
            Description = description,
            DurationMinutes = durationMinutes
        };
        return await _repository.CreateAsync(eventType);
    }

    public async Task<EventType?> UpdateAsync(Guid id, string? name, string? description, int? durationMinutes)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
            return null;

        if (name is not null) existing.Name = name;
        if (description is not null) existing.Description = description;
        if (durationMinutes.HasValue) existing.DurationMinutes = durationMinutes.Value;

        return await _repository.UpdateAsync(existing);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _repository.DeleteAsync(id);
    }
}

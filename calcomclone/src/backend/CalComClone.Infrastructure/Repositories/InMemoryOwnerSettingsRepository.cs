using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.Infrastructure.Repositories;

public class InMemoryOwnerSettingsRepository : IOwnerSettingsRepository
{
    private OwnerSettings? _settings;

    public Task<OwnerSettings?> GetAsync()
    {
        return Task.FromResult(_settings);
    }

    public Task SaveAsync(OwnerSettings settings)
    {
        _settings = settings;
        return Task.CompletedTask;
    }
}

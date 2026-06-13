using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;

namespace CalComClone.UseCases;

public class OwnerSettingsService
{
    private readonly IOwnerSettingsRepository _repository;

    public OwnerSettingsService(IOwnerSettingsRepository repository)
    {
        _repository = repository;
    }

    public async Task<OwnerSettings?> GetAsync()
    {
        return await _repository.GetAsync();
    }

    public async Task SaveAsync(OwnerSettings settings)
    {
        await _repository.SaveAsync(settings);
    }
}

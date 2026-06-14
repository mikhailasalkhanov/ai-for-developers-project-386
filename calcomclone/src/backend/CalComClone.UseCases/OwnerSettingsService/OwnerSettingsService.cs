using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;
using FluentValidation;

namespace CalComClone.UseCases.OwnerSettingsService;

public class OwnerSettingsService
{
    private readonly IOwnerSettingsRepository _repository;
    private readonly IValidator<OwnerSettings> _validator;

    public OwnerSettingsService(IOwnerSettingsRepository repository, IValidator<OwnerSettings> validator)
    {
        _repository = repository;
        _validator = validator;
    }

    public async Task<OwnerSettings?> GetAsync()
    {
        return await _repository.GetAsync();
    }

    public async Task SaveAsync(OwnerSettings settings)
    {
        await _validator.ValidateAndThrowAsync(settings);
        await _repository.SaveAsync(settings);
    }
}

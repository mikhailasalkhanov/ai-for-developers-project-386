using CalComClone.Core.Models;

namespace CalComClone.Core.Interfaces;

public interface IOwnerSettingsRepository
{
    Task<OwnerSettings?> GetAsync();
    Task SaveAsync(OwnerSettings settings);
}

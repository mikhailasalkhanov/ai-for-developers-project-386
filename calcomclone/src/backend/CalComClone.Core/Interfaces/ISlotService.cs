using CalComClone.Core.Models;

namespace CalComClone.Core.Interfaces;

public interface ISlotService
{
    Task<IReadOnlyList<Slot>> GetAvailableSlotsAsync(Guid eventTypeId);
}

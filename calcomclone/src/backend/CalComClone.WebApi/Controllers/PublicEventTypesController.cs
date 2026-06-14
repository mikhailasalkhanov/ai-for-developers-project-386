using CalComClone.Core.Interfaces;
using CalComClone.Core.Models;
using CalComClone.Requests;
using CalComClone.Requests.Shared;
using CalComClone.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace CalComClone.Controllers;

[ApiController]
[Route("public/event-types")]
public class PublicEventTypesController : ControllerBase
{
    private readonly EventTypeService _eventTypeService;
    private readonly ISlotService _slotService;

    public PublicEventTypesController(EventTypeService eventTypeService, ISlotService slotService)
    {
        _eventTypeService = eventTypeService;
        _slotService = slotService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EventType>>> List()
    {
        var eventTypes = await _eventTypeService.ListAsync();
        return Ok(eventTypes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventType>> GetById(Guid id)
    {
        var eventType = await _eventTypeService.GetByIdAsync(id);
        if (eventType is null)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Event type not found" });
        return Ok(eventType);
    }

    [HttpGet("{id}/slots")]
    public async Task<ActionResult<IReadOnlyList<Slot>>> GetSlots(Guid id)
    {
        var eventType = await _eventTypeService.GetByIdAsync(id);
        if (eventType is null)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Event type not found" });

        var slots = await _slotService.GetAvailableSlotsAsync(id);
        return Ok(slots);
    }
}

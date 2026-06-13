using CalComClone.Core.Models;
using CalComClone.Responses;
using CalComClone.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace CalComClone.Controllers;

[ApiController]
[Route("admin/event-types")]
public class AdminEventTypesController : ControllerBase
{
    private readonly EventTypeService _service;

    public AdminEventTypesController(EventTypeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<EventType>>> List()
    {
        var eventTypes = await _service.ListAsync();
        return Ok(eventTypes);
    }

    [HttpPost]
    public async Task<ActionResult<EventType>> Create([FromBody] EventTypeCreateRequest body)
    {
        var created = await _service.CreateAsync(body.Name, body.Description, body.DurationMinutes);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventType>> GetById(Guid id)
    {
        var eventType = await _service.GetByIdAsync(id);
        if (eventType is null)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Event type not found" });
        return Ok(eventType);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<EventType>> Update(Guid id, [FromBody] EventTypeUpdateRequest body)
    {
        var updated = await _service.UpdateAsync(id, body.Name, body.Description, body.DurationMinutes);
        if (updated is null)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Event type not found" });
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Event type not found" });
        return NoContent();
    }
}

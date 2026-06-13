using CalComClone.Core.Models;
using CalComClone.Responses;
using CalComClone.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace CalComClone.Controllers;

[ApiController]
[Route("public/bookings")]
public class PublicBookingsController : ControllerBase
{
    private readonly BookingService _service;

    public PublicBookingsController(BookingService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<Booking>> Create([FromBody] BookingCreateRequest body)
    {
        var created = await _service.CreateAsync(body.EventTypeId, body.StartTime, body.GuestName);
        if (created is null)
            return BadRequest(new ApiErrorResponse { Code = 400, Message = "Event type not found" });

        return Created(string.Empty, created);
    }
}

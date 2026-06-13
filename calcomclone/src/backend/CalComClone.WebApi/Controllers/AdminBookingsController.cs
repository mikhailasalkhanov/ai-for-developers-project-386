using CalComClone.Core.Models;
using CalComClone.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace CalComClone.Controllers;

[ApiController]
[Route("admin/bookings")]
public class AdminBookingsController : ControllerBase
{
    private readonly BookingService _service;

    public AdminBookingsController(BookingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Booking>>> List(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var bookings = await _service.ListAsync(from, to);
        return Ok(bookings);
    }
}

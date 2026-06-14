using CalComClone.Core.Models;
using CalComClone.Requests;
using CalComClone.Requests.OwnerSettingsUpdate;
using CalComClone.Requests.Shared;
using CalComClone.UseCases;
using CalComClone.UseCases.OwnerSettingsService;
using Microsoft.AspNetCore.Mvc;

namespace CalComClone.Controllers;

[ApiController]
[Route("admin/settings")]
public class AdminSettingsController : ControllerBase
{
    private readonly OwnerSettingsService _service;

    public AdminSettingsController(OwnerSettingsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<OwnerSettings>> Get()
    {
        var settings = await _service.GetAsync();
        if (settings is null)
            return NotFound(new ApiErrorResponse { Code = 404, Message = "Settings not found" });
        return Ok(settings);
    }

    [HttpPut]
    public async Task<ActionResult<OwnerSettings>> Update([FromBody] OwnerSettingsUpdateRequest body)
    {
        var settings = new OwnerSettings
        {
            Timezone = body.Timezone,
            Monday = body.Monday,
            Tuesday = body.Tuesday,
            Wednesday = body.Wednesday,
            Thursday = body.Thursday,
            Friday = body.Friday,
            Saturday = body.Saturday,
            Sunday = body.Sunday,
        };
        await _service.SaveAsync(settings);
        return Ok(settings);
    }
}

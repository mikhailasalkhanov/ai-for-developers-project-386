using CalComClone.Core.Interfaces;
using CalComClone.Filters;
using CalComClone.Infrastructure.Repositories;
using CalComClone.UseCases;
using CalComClone.UseCases.OwnerSettingsService;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IOwnerSettingsRepository, InMemoryOwnerSettingsRepository>();
builder.Services.AddSingleton<IEventTypeRepository, InMemoryEventTypeRepository>();
builder.Services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();

builder.Services.AddSingleton<OwnerSettingsService>();
builder.Services.AddSingleton<EventTypeService>();
builder.Services.AddSingleton<BookingService>();
builder.Services.AddSingleton<ISlotService, SlotService>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddValidatorsFromAssemblyContaining<OwnerSettingsService>();
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddControllers(options =>
    {
        options.Filters.Add<DomainExceptionFilter>();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();

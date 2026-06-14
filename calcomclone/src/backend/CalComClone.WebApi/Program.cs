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

builder.Services.AddScoped<OwnerSettingsService>();
builder.Services.AddScoped<EventTypeService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<ISlotService, SlotService>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddValidatorsFromAssemblyContaining<OwnerSettingsService>();
builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

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

app.UseCors();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

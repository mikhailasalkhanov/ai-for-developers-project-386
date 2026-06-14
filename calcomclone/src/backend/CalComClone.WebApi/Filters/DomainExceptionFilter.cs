using CalComClone.Core.Exceptions;
using CalComClone.Requests;
using CalComClone.Requests.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using FluentValidation;

namespace CalComClone.Filters;

public class DomainExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is DomainException domainEx)
        {
            context.Result = new ObjectResult(new ApiErrorResponse
            {
                Code = domainEx.StatusCode,
                Message = domainEx.Message
            })
            { StatusCode = domainEx.StatusCode };
            context.ExceptionHandled = true;
        }
        else if (context.Exception is ValidationException validationEx)
        {
            var message = string.Join("; ", validationEx.Errors.Select(e => e.ErrorMessage));
            context.Result = new ObjectResult(new ApiErrorResponse
            {
                Code = 400,
                Message = message
            })
            { StatusCode = 400 };
            context.ExceptionHandled = true;
        }
    }
}

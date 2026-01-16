using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.ContactSubmissions.Commands.CreateContactSubmission;
using FluentValidation;

namespace MyApp.Web.Endpoints.Public.V1;

public class ContactSubmissions : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateContactSubmission).WithName("PublicCreateContactSubmission");
    }

    /// <summary>
    /// Submit a contact form with reCAPTCHA validation
    /// </summary>
    /// <remarks>
    /// Submits a new contact form entry. The request must include a valid Google reCAPTCHA v3 token.
    /// 
    /// **Required Fields:**
    /// - fullName: The submitter's full name
    /// - email: Valid email address
    /// - message: The contact message
    /// - type: The type of submission (0 for "message", 1 for "testDrive")
    /// - recaptchaToken: Google reCAPTCHA v3 token
    ///
    /// **Optional Fields:**
    /// - extraDetails: Additional information or context
    /// 
    /// **Example Request:**
    /// ```json
    /// {
    ///   "fullName": "John Doe",
    ///   "email": "john@example.com",
    ///   "message": "I'm interested in your services",
    ///   "type": 0,
    ///   "extraDetails": "Please contact me about pricing",
    ///   "recaptchaToken": "03AGdBq27..."
    /// }
    /// ```
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Contact submission data</param>
    /// <returns>ID of the created contact submission</returns>
    public async Task<Results<Created<int>, BadRequest<string>>> CreateContactSubmission(
        ISender sender,
        CreateContactSubmissionCommand command)
    {
        try
        {
            var id = await sender.Send(command);
            return TypedResults.Created($"/contact-submissions/{id}", id);
        }
        catch (FluentValidation.ValidationException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }
}
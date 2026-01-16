using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.NewsletterSubscriptions.Commands.CreateNewsletterSubscription;
using FluentValidation;

namespace MyApp.Web.Endpoints.Public.V1;

public class NewsletterSubscriptions : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(CreateNewsletterSubscription).WithName("PublicCreateNewsletterSubscription");
    }

    /// <summary>
    /// Subscribe to newsletter with reCAPTCHA validation
    /// </summary>
    /// <remarks>
    /// Subscribes an email to the newsletter. The request must include a valid Google reCAPTCHA v3 token.
    /// If the email is already subscribed, the existing subscription ID is returned without error.
    ///
    /// **Required Fields:**
    /// - email: Valid email address to subscribe
    /// - recaptchaToken: Google reCAPTCHA v3 token
    ///
    /// **Example Request:**
    /// ```json
    /// {
    ///   "email": "john@example.com",
    ///   "recaptchaToken": "03AGdBq27..."
    /// }
    /// ```
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Newsletter subscription data</param>
    /// <returns>ID of the created or existing subscription</returns>
    public async Task<Results<Created<int>, BadRequest<string>>> CreateNewsletterSubscription(
        ISender sender,
        CreateNewsletterSubscriptionCommand command)
    {
        try
        {
            var id = await sender.Send(command);
            return TypedResults.Created($"/newsletter-subscriptions/{id}", id);
        }
        catch (FluentValidation.ValidationException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }
}

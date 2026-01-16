using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.NewsletterSubscriptions.Commands.DeleteNewsletterSubscription;
using MyApp.Application.NewsletterSubscriptions.Queries.GetNewsletterSubscription;
using MyApp.Application.NewsletterSubscriptions.Queries.GetNewsletterSubscriptionsList;
using MyApp.Application.Common.Models;
using MyApp.Application.NewsletterSubscriptions.Common;
using MyApp.Domain.Constants;

namespace MyApp.Web.Endpoints.Admin.V1;

public class NewsletterSubscriptions : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetNewsletterSubscriptionsList).RequireAuthorization();
        groupBuilder.MapGet(GetNewsletterSubscription, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteNewsletterSubscription, "{id}").RequireAuthorization();
    }

    /// <summary>
    /// Get paginated list of newsletter subscriptions
    /// </summary>
    /// <remarks>
    /// Retrieves a paginated list of newsletter subscriptions for admin viewing. Supports filtering and search.
    ///
    /// **Filters:**
    /// - search: Search across email addresses
    /// - email: Filter by email (contains)
    /// - isActive: Filter by active status (true/false)
    ///
    /// **Examples:**
    /// <![CDATA[
    /// - GET /api/Admin/V1/NewsletterSubscriptions?pageNumber=1&pageSize=10
    /// - GET /api/Admin/V1/NewsletterSubscriptions?search=john&isActive=true
    /// - GET /api/Admin/V1/NewsletterSubscriptions?email=gmail.com&pageSize=20
    /// ]]>
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10, max: 100)</param>
    /// <param name="search">Search term to filter subscriptions</param>
    /// <param name="email">Filter by email address</param>
    /// <param name="isActive">Filter by active status</param>
    /// <returns>Paginated list of newsletter subscriptions</returns>
    [Authorize(Roles = Roles.Administrator)]
    public async Task<Ok<PaginatedList<NewsletterSubscriptionListDto>>> GetNewsletterSubscriptionsList(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? search = null,
        string? email = null,
        bool? isActive = null)
    {
        // Validate and limit page size for performance
        if (pageSize.HasValue && (pageSize.Value <= 0 || pageSize.Value > 100))
        {
            pageSize = 10;
        }

        var query = new GetNewsletterSubscriptionsListQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            Email = email,
            IsActive = isActive
        };

        var subscriptions = await sender.Send(query);

        return TypedResults.Ok(subscriptions);
    }

    /// <summary>
    /// Get a newsletter subscription by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Newsletter subscription ID</param>
    /// <returns>Newsletter subscription details or 404 if not found</returns>
    [Authorize(Roles = Roles.Administrator)]
    public async Task<Results<Ok<NewsletterSubscriptionDto>, NotFound>> GetNewsletterSubscription(ISender sender, int id)
    {
        var subscription = await sender.Send(new GetNewsletterSubscriptionQuery { Id = id });

        return subscription is null ? TypedResults.NotFound() : TypedResults.Ok(subscription);
    }

    /// <summary>
    /// Delete a newsletter subscription
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Newsletter subscription ID</param>
    /// <returns>No content if successful, 404 if not found</returns>
    [Authorize(Roles = Roles.Administrator)]
    public async Task<Results<NoContent, NotFound>> DeleteNewsletterSubscription(ISender sender, int id)
    {
        await sender.Send(new DeleteNewsletterSubscriptionCommand { Id = id });

        return TypedResults.NoContent();
    }
}

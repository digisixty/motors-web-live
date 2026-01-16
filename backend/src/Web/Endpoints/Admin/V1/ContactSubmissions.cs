using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.ContactSubmissions.Commands.DeleteContactSubmission;
using MyApp.Application.ContactSubmissions.Queries.GetContactSubmission;
using MyApp.Application.ContactSubmissions.Queries.GetContactSubmissionsList;
using MyApp.Application.Common.Models;
using MyApp.Application.ContactSubmissions.Common;
using MyApp.Domain.Enums;

namespace MyApp.Web.Endpoints.Admin.V1;

public class ContactSubmissions : EndpointGroupBase
{
    public override string? Scope => "Admin/V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetContactSubmissionsList).RequireAuthorization();
        groupBuilder.MapGet(GetContactSubmission, "{id}").RequireAuthorization();
        groupBuilder.MapDelete(DeleteContactSubmission, "{id}").RequireAuthorization();
    }

    /// <summary>
    /// Get paginated list of contact submissions
    /// </summary>
    /// <remarks>
    /// Retrieves a paginated list of contact submissions for admin viewing. Supports filtering and search.
    ///
    /// **Filters:**
    /// - search: Search across full name, email, message, and extra details
    /// - fullName: Filter by full name (contains)
    /// - email: Filter by email (contains)
    /// - isProcessed: Filter by processed status (true/false)
    /// - type: Filter by submission type (0 for "message", 1 for "testDrive")
    ///
    /// **Examples:**
    /// <![CDATA[
    /// - GET /api/Admin/V1/ContactSubmissions?pageNumber=1&pageSize=10
    /// - GET /api/Admin/V1/ContactSubmissions?search=john&isProcessed=false
    /// - GET /api/Admin/V1/ContactSubmissions?email=gmail.com&pageSize=20
    /// - GET /api/Admin/V1/ContactSubmissions?type=1
    /// ]]>
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="pageNumber">Page number for pagination (default: 1)</param>
    /// <param name="pageSize">Number of items per page (default: 10, max: 100)</param>
    /// <param name="search">Search term to filter submissions</param>
    /// <param name="fullName">Filter by full name</param>
    /// <param name="email">Filter by email address</param>
    /// <param name="isProcessed">Filter by processed status</param>
    /// <param name="type">Filter by submission type (0 for "message", 1 for "testDrive")</param>
    /// <returns>Paginated list of contact submissions</returns>
    public async Task<Ok<PaginatedList<ContactSubmissionListDto>>> GetContactSubmissionsList(
        ISender sender,
        int? pageNumber = 1,
        int? pageSize = 10,
        string? search = null,
        string? fullName = null,
        string? email = null,
        bool? isProcessed = null,
        ContactSubmissionType? type = null)
    {
        // Validate and limit page size for performance
        if (pageSize.HasValue && (pageSize.Value <= 0 || pageSize.Value > 100))
        {
            pageSize = 10;
        }

        var query = new GetContactSubmissionsListQuery
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            Search = search,
            FullName = fullName,
            Email = email,
            IsProcessed = isProcessed,
            Type = type
        };

        var submissions = await sender.Send(query);

        return TypedResults.Ok(submissions);
    }

    /// <summary>
    /// Get a contact submission by ID
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Contact submission ID</param>
    /// <returns>Contact submission details or 404 if not found</returns>
    public async Task<Results<Ok<ContactSubmissionDto>, NotFound>> GetContactSubmission(ISender sender, int id)
    {
        var submission = await sender.Send(new GetContactSubmissionQuery { Id = id });

        return submission is null ? TypedResults.NotFound() : TypedResults.Ok(submission);
    }

    /// <summary>
    /// Delete a contact submission
    /// </summary>
    /// <param name="sender">MediatR sender</param>
    /// <param name="id">Contact submission ID</param>
    /// <returns>No content if successful, 404 if not found</returns>
    public async Task<Results<NoContent, NotFound>> DeleteContactSubmission(ISender sender, int id)
    {
        await sender.Send(new DeleteContactSubmissionCommand { Id = id });

        return TypedResults.NoContent();
    }
}
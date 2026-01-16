using Microsoft.AspNetCore.Http.HttpResults;
using MyApp.Application.Authentication.Commands.Login;
using MyApp.Application.Authentication.Commands.RegisterUser;
using FluentValidation;

namespace MyApp.Web.Endpoints.Public.V1;

public class Auth : EndpointGroupBase
{
    public override string? Scope => "V1";

    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapPost(Register, "/register").WithName("PublicRegister");
        groupBuilder.MapPost(Login, "/login").WithName("PublicLogin");
    }

    /// <summary>
    /// Register a new user with email and password
    /// </summary>
    /// <remarks>
    /// Registers a new user account. The request must include a valid Google reCAPTCHA v3 token.
    ///
    /// **Required Fields:**
    /// - email: Valid email address (will be used as username)
    /// - password: Password (minimum 6 characters)
    /// - recaptchaToken: Google reCAPTCHA v3 token
    ///
    /// **Example Request:**
    /// ```json
    /// {
    ///   "email": "user@example.com",
    ///   "password": "password123",
    ///   "recaptchaToken": "03AGdBq27..."
    /// }
    /// ```
    ///
    /// **Success Response:**
    /// ```json
    /// {
    ///   "success": true,
    ///   "errors": []
    /// }
    /// ```
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Registration data</param>
    /// <returns>Registration result</returns>
    public async Task<Results<Ok<RegisterUserResponse>, BadRequest<RegisterUserResponse>>> Register(
        ISender sender,
        RegisterUserCommand command)
    {
        var response = await sender.Send(command);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }

    /// <summary>
    /// Login with username (email) and password
    /// </summary>
    /// <remarks>
    /// Authenticates a user and returns a JWT token.
    ///
    /// **Required Fields:**
    /// - userName: Username (email address used during registration)
    /// - password: User password
    ///
    /// **Example Request:**
    /// ```json
    /// {
    ///   "userName": "user@example.com",
    ///   "password": "password123"
    /// }
    /// ```
    ///
    /// **Success Response:**
    /// ```json
    /// {
    ///   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    ///   "success": true,
    ///   "errors": []
    /// }
    /// ```
    ///
    /// The returned token should be included in the Authorization header for authenticated requests:
    /// ```
    /// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    /// ```
    /// </remarks>
    /// <param name="sender">MediatR sender</param>
    /// <param name="command">Login credentials</param>
    /// <returns>Login result with JWT token</returns>
    public async Task<Results<Ok<LoginResponse>, BadRequest<LoginResponse>>> Login(
        ISender sender,
        LoginCommand command)
    {
        var response = await sender.Send(command);

        if (response.Success)
        {
            return TypedResults.Ok(response);
        }

        return TypedResults.BadRequest(response);
    }
}

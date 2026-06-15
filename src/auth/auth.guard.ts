import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";


/**
 * AuthGuard - JWT Authentication Guard
 * 
 * FLOW:
 * 1. Request comes in (e.g. GET /api/notes)
 * 2. NestJS checks if route has @UseGuards(AuthGuard)
 * 3. If yes, canActivate() is called BEFORE the controller
 * 4. We extract the token from Authorization header
 *    - Header format: "Bearer eyJhbGci..."
 *    - We split by space and take the second part (token)
 * 5. If no token → throw 401 UnauthorizedException
 * 6. If token exists → verify it using JWT_SECRET
 *    - Valid token   → extract payload (userId, email etc) 
 *                    → attach to request.user
 *                    → return true (allow request)
 *    - Invalid/Expired token → throw 401 UnauthorizedException
 * 
 * Think of it like a Security Filter in Spring Security!
 */

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        // Step 1: Get the incoming HTTP request
        const request = context.switchToHttp().getRequest();

        // Step 2: Extract token from "Authorization: Bearer <token>" header
        const token = this.extractTokenFromHeader(request);

        // Step 3: If no token found, reject the request immediately
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            // Step 4: Verify the token using JWT_SECRET
            // If token is tampered or expired, this will throw an error
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            });

            // Step 5: Attach decoded payload to request object
            // Now any controller can access req.user to get logged in user info
            request['user'] = payload;

            // Step 6: Return true = allow the request to proceed
            return true;

        } catch {
            // Token is invalid or expired
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Extracts JWT token from Authorization header
     * Header format: "Bearer eyJhbGciOiJIUzI1NiJ9..."
     * We split by space → ["Bearer", "eyJhbGci..."]
     * We check type === "Bearer" and return the token part
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
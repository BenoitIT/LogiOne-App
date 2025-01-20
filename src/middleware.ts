"use client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (request.nextUrl.pathname.startsWith("/api/users/resetlink")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.includes("password")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.includes("/api/auth")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!authHeader) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Authentication required",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    try {
      const token = authHeader.split(" ")[1];
      const isValidToken = await verifyToken(token);
      if (!isValidToken) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Invalid token",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      return NextResponse.next();
    } catch (error) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid token format",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
  return NextResponse.redirect(new URL("/home", request.url));
}
async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.NEXT_JWT_SECRETE);

    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    return payload ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const config = {
  matcher: [
    "/api/stuffingreports/:path*",
    "/api/users/:path*",
    "/api/commissions/:path*",
    "/api/containerspayments/:path*",
    "/api/financialreport",
    "/api/invoices",
    "/api/shippinginstruction",
    "/api/report",
  ],
};

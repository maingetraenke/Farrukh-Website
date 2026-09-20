import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

// Next.js 16 renamed `middleware`/`middleware.ts` to `proxy`/`proxy.ts`.
// Refreshes the Supabase session cookie on every navigation so Server
// Components always see a valid (or correctly expired) session.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Without these, createServerClient throws synchronously and takes down
  // every request on this deployment (proxy runs before any page/error
  // boundary). Fail soft instead: skip the session refresh so the app is
  // at least reachable and the misconfiguration is visible in server logs
  // rather than as a blanket 500 on every route.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[proxy] Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — skipping session refresh. Set these in the deployment's environment variables.",
    );
    return response;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

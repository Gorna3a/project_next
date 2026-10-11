import { NextRequest, NextResponse } from "next/server";

// ─── Judge0 proxy ─────────────────────────────────────────────────────────────
// Browser calls to a Judge0 API hit CORS limits, so the client posts to this
// same-origin route and we forward server-side. Set JUDGE0_UPSTREAM to your
// own instance; it defaults to the public community server.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.JUDGE0_UPSTREAM ?? "https://ce.judge0.com";

async function forward(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  const url = `${UPSTREAM}/${path.join("/")}${req.nextUrl.search}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
      cache: "no-store",
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Judge0 upstream unreachable: ${e instanceof Error ? e.message : String(e)}` },
      { status: 502 },
    );
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type ClickBody = {
  profileId: string;
  linkType: "kakao" | "instagram";
};

export async function POST(req: NextRequest) {
  let body: ClickBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { profileId, linkType } = body;
  if (!profileId || !["kakao", "instagram"].includes(linkType)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("link_clicks")
    .insert({ profile_id: profileId, link_type: linkType });

  if (error) {
    console.error("[track/click]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

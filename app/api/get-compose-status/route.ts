import { NextResponse } from "next/server";
import axios from "redaxios";

export const runtime = "edge";

export async function POST(request: Request) {
  const json = await request.json();

  const { data } = await axios.get(
    `https://sync.beatoven.ai/api/v1/status/${json.taskId}`,
    {
      headers: {
        Authorization: "api_key Rv3SxJThQavdeyUP9_nNJaz2-H3pVf97fcwrw2pdVKk",
      },
    }
  );

  return NextResponse.json({
    result: "success",
    data,
  });
}

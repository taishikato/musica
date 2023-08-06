import { NextResponse } from "next/server";
import axios from "redaxios";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { data } = await axios.post(
      "https://sync.beatoven.ai/api/v1/tracks",
      {
        duration_ms: 60000,
        tempo: "medium",
        title: "demo",
        genre: "indie",
        sections: [
          {
            emotion: "happy",
            length: 60000,
            start: 0,
          },
        ],
      },
      {
        headers: {
          Authorization: "api_key Rv3SxJThQavdeyUP9_nNJaz2-H3pVf97fcwrw2pdVKk",
        },
      }
    );

    console.log("INFO", `return value from ${JSON.stringify(data)}`);

    const { data: composeResult } = await axios.post(
      `https://sync.beatoven.ai/api/v1/tracks/${data.uuid}/compose`,
      {},
      {
        headers: {
          Authorization: "api_key Rv3SxJThQavdeyUP9_nNJaz2-H3pVf97fcwrw2pdVKk",
        },
      }
    );

    return NextResponse.json({
      result: "success",
      taskId: composeResult.task_id,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        result: "error",
      },
      { status: 400 }
    );
  }
}

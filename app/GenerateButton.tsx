"use client";

import type { Database } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { syne } from "@/fonts/font";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "redaxios";

export const GenerateButton = () => {
  const supabase = createClientComponentClient<Database>();
  const [callingNewTrack, setCallingNewTrack] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [callingTaskStatus, setCallingTaskStatus] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);
  const [tracks, setTracks] = useState<any>(null);

  const generateSong = async () => {
    setCallingNewTrack(true);

    const { data } = await axios.post("/api/create-new-song");

    setTaskId(data.taskId);

    setCallingNewTrack(false);
  };

  useEffect(() => {
    const fetchTracks = async () => {
      const { data } = await supabase.from("tracks").select("*");

      const audioData = [];
      if (data) {
        for (const d of data) {
          const { data: urlData, error } = await supabase.storage
            .from("tracks")
            .createSignedUrl(`public/${d.task_id}.mp3`, 3600);

          audioData.push({
            id: d.id,
            url: urlData?.signedUrl,
          });
        }
      }

      setTracks(audioData);
    };

    fetchTracks();
  }, []);

  return (
    <>
      <Button
        disabled={callingNewTrack}
        onClick={generateSong}
        className="px-6 py-3 text-sm bg-foreground text-background rounded-xl"
      >
        {callingNewTrack && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Create a new track
      </Button>

      {taskId && (
        <div>
          <Button
            disabled={callingTaskStatus}
            className="mt-3 rounded-xl"
            onClick={async () => {
              setCallingTaskStatus(true);

              const { data } = await axios.post("/api/get-compose-status", {
                taskId,
              });
              setTaskResult(data);
              setCallingTaskStatus(false);
            }}
          >
            {callingTaskStatus && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Check task
          </Button>

          {taskResult && taskResult.data.state === "SUCCESS" && (
            <>
              <audio controls>
                <source
                  src={taskResult.data.meta[0][0].track_url}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
              <Button
                className="rounded-xl"
                onClick={async () => {
                  console.log(
                    "taskResult.data.meta[0][0].track_url",
                    taskResult.data.meta[0][0].track_url
                  );

                  const res = await fetch(taskResult.data.meta[0][0].track_url);
                  const blob = await res.blob();
                  const file = new File([blob], "file.mp3", {
                    type: "audio/mpeg",
                  });

                  const { data, error } = await supabase.storage
                    .from("tracks")
                    .upload(`public/${taskId}.mp3`, file, {
                      cacheControl: "3600",
                      upsert: true,
                      contentType: "audio/mp3",
                      // contentType: "audio/mpeg",
                    });

                  await supabase.from("tracks").insert({
                    task_id: taskId,
                  });

                  console.log({ data }, { error });
                }}
              >
                Save on storage
              </Button>
            </>
          )}
        </div>
      )}
      <div className="mt-14">
        <h2 className={`font-semibold text-2xl ${syne.className}`}>Gallery</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tracks &&
            tracks.map(({ id, url }) => (
              <a
                key={id}
                className="relative flex flex-col p-6 border rounded-lg group hover:border-foreground"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <h3 className="font-bold mb-2  min-h-[40px] lg:min-h-[60px]">
                  {/* {title} */}
                </h3>
                <div className="flex flex-col justify-between gap-4 grow">
                  {/* <p className="text-sm opacity-70">{subtitle}</p> */}
                  {/* <div className="flex items-center justify-between">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-80 group-hover:opacity-100"
                  >
                    <path
                      d={icon}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 ml-2 transition-all -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div> */}
                  <audio controls>
                    <source src={url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </a>
            ))}
        </div>
      </div>
    </>
  );
};

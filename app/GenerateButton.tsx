"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "redaxios";

export const GenerateButton = () => {
  const [callingNewTrack, setCallingNewTrack] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [callingTaskStatus, setCallingTaskStatus] = useState(false);
  const [taskResult, setTaskResult] = useState<any>(null);

  const generateSong = async () => {
    setCallingNewTrack(true);

    const { data } = await axios.post("/api/create-new-song");

    setTaskId(data.taskId);

    setCallingNewTrack(false);
  };

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
              <Button className="rounded-xl">Save on storage</Button>
            </>
          )}
        </div>
      )}
    </>
  );
};

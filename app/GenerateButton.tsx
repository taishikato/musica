"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "redaxios";

export const GenerateButton = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<any>(null);

  const generateSong = async () => {
    const { data } = await axios.post("/api/create-new-song");

    setTaskId(data.taskId);
  };

  return (
    <>
      <Button
        onClick={generateSong}
        className="px-6 py-3 text-sm rounded-lg bg-foreground text-background"
      >
        Create a new track
      </Button>

      {taskId && (
        <div>
          <Button
            className="mt-3"
            onClick={async () => {
              const { data } = await axios.post("/api/get-compose-status", {
                taskId,
              });
              setTaskResult(data);
            }}
          >
            Check task
          </Button>

          {taskResult && taskResult.data.state === "SUCCESS" && (
            <audio controls>
              <source
                src={taskResult.data.meta[0][0].track_url}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          )}
        </div>
      )}
    </>
  );
};

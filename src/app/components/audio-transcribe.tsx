"use client";

import { useEffect, useState } from "react";
import FileUpload from "./file-upload";

type AudioTranscribeProps = {
  updateCaption: (caption: string, userType?: 'user' | 'assistant') => void;
};

export default function AudioTranscribe({
  updateCaption,
}: AudioTranscribeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const callGetTranscription = async () => {
    setIsLoading(true);
    if (!audioFile) {
      updateCaption("Please upload a file first.", 'assistant');
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("file", audioFile);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData
      });

      const { output: caption, error } = await response.clone().json();
      if (!response.ok) {
        throw new Error(`Failed to transcribe the audio file: ${error.trim()}`);
      }

      updateCaption(caption);
    } catch (error) {
      updateCaption((error as Error).message);
    } finally {
      setAudioFile(null);
      setIsLoading(false);
    }
  };

  const FileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setAudioFile(file);
  };

  useEffect(() => {
    if (audioFile) {
      updateCaption(`Hey, transcribe "${audioFile.name}" like a linguistic pro`, 'user');
      callGetTranscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile]);

  return (
    <FileUpload
      onChange={FileChange}
      fileType="audio/*"
      isLoading={isLoading}
    />
  );
}

import  { useState, useRef } from "react";
import { axios } from "../lib/axios";

function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    audioChunksRef.current = []; // Clear previous recordings
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder instance (webm is widely supported, but you can use mp3/wav with libraries if needed)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      // Push data chunks as they become available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, create a local URL for playback and upload it
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url); // For instant local replay

        // Upload to backend
        await uploadAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      // Stop all tracks on the stream to turn off the microphone light
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setRecording(false);
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    // Append the blob file. 'audiofile' is the key the backend will look for
    formData.append("audiofile", audioBlob, `recording-${Date.now()}.webm`);

    try {
      // const response = await fetch("http://localhost:5000/upload", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await response.json();
      // use axios instead
      const response = await axios.post("http://localhost:3000/api/test/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log("Server response:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audio Recorder</h2>
      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button
          onClick={stopRecording}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Stop Recording
        </button>
      )}

      {audioUrl && (
        <div style={{ marginTop: "20px" }}>
          <h3>Local Replay:</h3>
          <audio src={audioUrl} controls />
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;

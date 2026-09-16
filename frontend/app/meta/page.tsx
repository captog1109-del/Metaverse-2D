"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import GameCanvas from "../components/gameCanvas";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl && process.env.NODE_ENV === "production") {
      console.error("NEXT_PUBLIC_SERVER_URL is not configured.");
      return;
    }

    const socket = io(serverUrl || "http://localhost:5000");
    setSocket(socket);

    socket.on("connect", () => {
      setSocketReady(true);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection failed:", error.message);
    });

    return () => {
      socket.disconnect();
      setSocket(null);
      setSocketReady(false);
    };
  }, []);

  return (
    <>
      {socketReady && socket && <GameCanvas socket={socket} />}
    </>
  );
}
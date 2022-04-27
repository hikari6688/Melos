import React, { useCallback } from "react";
import { ws_host } from "../conf/config";
import { io as socketio } from "socket.io-client";
export default function connectWs() {
  const io = socketio(ws_host, {
    reconnectionDelayMax: 10000,
    autoConnect: false,
  });
  io.on("connect", () => {
    console.log(`socket.connect with id:${io.id}`); // false
  });
  function connect() {
    io.connect();
  }
  return { io, connect };
}

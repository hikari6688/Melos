import React, { useCallback, useRef } from "react";
import { ws_host } from "../conf/config";
import { io as socketio } from "socket.io-client";
export default function connectWs() {
  const io = socketio(ws_host, {
    reconnectionDelayMax: 10000,
    autoConnect: false,
  });
  function connect() {
    return new Promise((resolve, reject) => {
      io.connect();
      io.on("connect", () => {
        //client 连接成功
        console.log(`socket.connect with id:${io.id}`);
        sessionStorage.setItem("id", io.id);
        resolve(io);
      });
      io.on("connect_error", (reason) => {
        //client 连接错误
        console.log(`socket connect_error,and will reconnect in 1000ms`);
        connect();
      });
      io.on("disconnect", (reason) => {
        //client 断开连接
        console.log(`socket disconnect for ${reason}`);
        sessionStorage.removeItem("id");
      });
    });
  }
  return { connect };
}

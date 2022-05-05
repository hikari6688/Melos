import React, { createContext, useRef } from "react";
const SocketContext = createContext<{
  io: any;
  setIo: (ins: any) => void;
}>({
  io: null,
  setIo: (ins) => {},
});
const SocketProvider = (props: any): JSX.Element => {
  const ioRef = useRef(null);
  const setIo = (io: any) => {
    ioRef.current = io;
  };
  return (
    <SocketContext.Provider value={{ io: ioRef, setIo: setIo }}>
      {props.children}
    </SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };

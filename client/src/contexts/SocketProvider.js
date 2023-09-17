import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ id, children }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(
      "https://bookish-space-meme-69g7qrxpw45ph4p45-5000.app.github.dev",
      { query: { id } }
    );

    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

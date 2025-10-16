import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatGroupContext = createContext({
  isOpen: false,
});

export const ChatGroupProvider = ({ children }) => {
  const [groupRoomId, setGroupRoomId] = useState(null);
  return (
    <ChatGroupContext.Provider
      value={{
        setGroupRoomId,
        groupRoomId,
      }}
    >
      {children}
    </ChatGroupContext.Provider>
  );
};

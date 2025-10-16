import { createContext, useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatGroupContext = createContext({
  isOpen: false,
});

export const ChatGroupProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);
  const [groupRoomId, setGroupRoomId] = useState(null);

  const initialMatchGroupForm = {
    accountId: userId,
    interestIds: [],
  };

  const [matchGroupForm, setMatchGroupForm] = useState(initialMatchGroupForm);
  return (
    <ChatGroupContext.Provider
      value={{
        setGroupRoomId,
        groupRoomId,
        matchGroupForm,
        initialMatchGroupForm,
        setMatchGroupForm,
      }}
    >
      {children}
    </ChatGroupContext.Provider>
  );
};

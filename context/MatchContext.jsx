import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

// eslint-disable-next-line react-refresh/only-export-components
export const MatchContext = createContext({
  isOpen: false,
});

export const MatchProvider = ({ children }) => {
  const { userId } = useContext(AuthContext);

  const initialMatchForm = {
    accountId: userId,
    roomType: "",
    interestIds: [],
  };

  const [matchForm, setMatchForm] = useState(initialMatchForm);

  return (
    <MatchContext.Provider
      value={{
        matchForm,
        setMatchForm,
        initialMatchForm,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext({
  isOpen: false,
});

export const NotificationProvider = ({ children }) => {
  const [isOpenNotification, setIsOpenNotification] = useState(false);

  return (
    <NotificationContext.Provider
      value={{
        isOpenNotification,
        setIsOpenNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

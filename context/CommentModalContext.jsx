import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CommentModalContext = createContext({
  isOpen: false,
});

export const CommentModalProvider = ({ children }) => {
  const [commentModalPostId, setCommentModalPostId] = useState(null);

  return (
    <CommentModalContext.Provider
      value={{
        commentModalPostId,
        setCommentModalPostId,
      }}
    >
      {children}
    </CommentModalContext.Provider>
  );
};

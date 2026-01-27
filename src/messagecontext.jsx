import { createContext, useContext, useState, useCallback } from "react";
import MessageToast from "./messagetoast.jsx";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const showMessage = useCallback((text, type = "info", duration = 4000) => {
    setMessage({ text, type });

    setTimeout(() => {
      setMessage(null);
    }, duration);
  }, []);

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {message && <MessageToast message={message} />}
    </MessageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMessage = () => useContext(MessageContext);

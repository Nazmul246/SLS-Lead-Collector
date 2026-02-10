import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [overdueFollowUps, setOverdueFollowUps] = useState([]);
  const [openLeadId, setOpenLeadId] = useState(null); // ✅ add this

  return (
    <NotificationContext.Provider
      value={{
        overdueFollowUps,
        setOverdueFollowUps,
        openLeadId, // ✅ add
        setOpenLeadId, // ✅ add
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

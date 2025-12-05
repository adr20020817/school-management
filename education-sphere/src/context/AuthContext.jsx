import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // --- LOAD FROM STORAGE ONCE ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedParents = localStorage.getItem("parents");
    if (storedParents) setParents(JSON.parse(storedParents));
  }, []);

  // --- SAVE ON CHANGE ---
  useEffect(() => {
    localStorage.setItem("parents", JSON.stringify(parents));
  }, [parents]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // =============== NEW FUNCTIONS ===============

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // =============================================

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        parents,
        setParents,
        students,
        setStudents,
        teachers,
        setTeachers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

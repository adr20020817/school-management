import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedStudents = localStorage.getItem("students");
    if (storedStudents) setStudents(JSON.parse(storedStudents));

    const storedTeachers = localStorage.getItem("teachers");
    if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (values) => {
    const newUser = {
      id: Date.now(),
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      regNo:
        values.role === "student"
          ? `STD-${Math.floor(1000 + Math.random() * 9000)}`
          : null,
    };

    if (values.role === "student") {
      setStudents((prev) => [...prev, newUser]);
    }

    if (values.role === "teacher") {
      setTeachers((prev) => [...prev, newUser]);
    }

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return newUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register, // ✅ MUST BE HERE
        students,
        teachers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

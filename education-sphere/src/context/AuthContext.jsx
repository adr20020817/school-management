import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedStudents = localStorage.getItem("students");
    if (storedStudents) setStudents(JSON.parse(storedStudents));

    const storedTeachers = localStorage.getItem("teachers");
    if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("teachers", JSON.stringify(teachers));
  }, [teachers]);

  // ==================== REGISTER ====================
  const register = async (values) => {
    // Optional: Prevent duplicate email
    const emailExists =
      students.find((s) => s.email === values.email) ||
      teachers.find((t) => t.email === values.email);

    if (emailExists) {
      throw new Error("Email is already registered");
    }

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

    if (values.role === "student") setStudents((prev) => [...prev, newUser]);
    if (values.role === "teacher") setTeachers((prev) => [...prev, newUser]);

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    return newUser; // ✅ Must return for navigation
  };

  // ==================== LOGIN ====================
  const login = ({ identifier, password, role }) => {
    let users = [];
    if (role === "student") users = students;
    else if (role === "teacher") users = teachers;

    const foundUser = users.find(
      (u) => (u.email === identifier || u.regNo === identifier) && u.password === password
    );

    if (!foundUser) throw new Error("Invalid credentials");

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));

    return foundUser; // ✅ Must return for success message & navigation
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // =================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        students,
        teachers,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

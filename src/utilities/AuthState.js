import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../base"; // Ensure this is correctly set up

const AuthContext = createContext();

export const AuthState = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

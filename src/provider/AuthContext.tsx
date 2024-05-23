"use client";
import React, { createContext, useEffect, useState } from "react";
import instance from "./backend";

interface UserDetails {
  first_name: string;
  id: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userDetails: UserDetails;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
}

const AuthenticationContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userDetails: {
    first_name: "",
    id: "",
    email: "",
  },
  setIsAuthenticated: () => {}, // Placeholder functions
  setUserDetails: () => {},
});

const AuthContext = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    first_name: "",
    id: "",
    email: "",
  });

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated,
        userDetails,
        setIsAuthenticated,
        setUserDetails,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export { AuthContext, AuthenticationContext };

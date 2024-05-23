"use client";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import backend from "@/provider/backend";
import { AuthenticationContext } from "@/provider/AuthContext";
import { loginSchema, registerSchema } from "@/provider/zodProvider";
import { z } from "zod";

type Props = {};

interface LoginField {
  email: string;
  password: string;
}

interface RegisterField {
  firstName: string;
  email: string;
  password: string;
}

const Navbar = (props: Props) => {
  const { isAuthenticated, userDetails, setIsAuthenticated, setUserDetails } =
    useContext(AuthenticationContext);
  const [isUser, setIsUser] = useState(isAuthenticated);
  const [loginErrors, setLoginErrors] = useState<Partial<LoginField>>({});
  const [registerErrors, setRegisterErrors] = useState<Partial<RegisterField>>(
    {}
  );
  const [loginField, setLoginField] = useState<LoginField>({
    email: "",
    password: "",
  });
  const [registerField, setRegisterField] = useState<RegisterField>({
    firstName: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      const fetchData = async () => {
        try {
          const response = await backend.get("/notes/");
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [isAuthenticated]);
  const handleLoginSubmit = async () => {
    try {
      loginSchema.parse(loginField);
      const response = await backend.post("/accounts/login/", loginField);
      if (response.status === 200) {
        setIsAuthenticated(true);
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        setLoginField({ email: "", password: "" }); // clear login field
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLoginErrors(error.flatten().fieldErrors);
      } else {
        console.error("Login error:", error);
      }
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      registerSchema.parse(registerField);
      const response = await backend.post("/accounts/register/", {
        first_name: registerField.firstName,
        email: registerField.email,
        password: registerField.password,
      });

      if (response.status === 201) {
        // Update loginField only after successful registration
        try {
          const lresponse = await backend.post("/accounts/login/", {
            email: registerField.email,
            password: registerField.password,
          });
          if (lresponse.status === 200) {
            setIsAuthenticated(true);
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
          }
        } catch (error) {
          console.error("Registration error:", error);
        }

        setRegisterField({ firstName: "", email: "", password: "" });
      } else {
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setRegisterErrors(error.flatten().fieldErrors);
      } else {
        console.error("Registration error:", error);
      }
    }
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl text-white">Todo App</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto border-white focus:border-[#6e6e6e]"
          />
        </div>
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <Image
                  width={20}
                  height={20}
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-white"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    setIsAuthenticated(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <div className="text-white">
              <button
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_2"
                  ) as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Login
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <h1 className="text-center pb-[1vw] font-bold text-[1.5vw]">
                    Login
                  </h1>
                  <div className="flex flex-col space-y-[2vh]">
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                      </svg>
                      <input
                        type="text"
                        className="grow"
                        placeholder="Email"
                        value={loginField.email}
                        onChange={(e) => {
                          setLoginField({
                            email: e.target.value,
                            password: loginField.password,
                          });
                        }}
                      />
                    </label>
                    {loginErrors.email && ( // Display email error message
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.email}
                      </p>
                    )}
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="password"
                        className="grow"
                        placeholder="password"
                        value={loginField.password}
                        onChange={(e) => {
                          setLoginField({
                            email: loginField.email,
                            password: e.target.value,
                          });
                        }}
                      />
                    </label>
                    {loginErrors.password && ( // Display password error message
                      <p className="text-red-500 text-sm mt-1">
                        {loginErrors.password}
                      </p>
                    )}

                    <button
                      className="btn btn-secondary w-full"
                      onClick={handleLoginSubmit}
                    >
                      Login
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
            <div className="text-white">
              <button
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_1"
                  ) as HTMLDialogElement;
                  if (modal) {
                    modal.showModal();
                  }
                }}
              >
                Register
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h1 className="text-center pb-[1vw] font-bold text-[1.5vw]">
                    Create Account
                  </h1>
                  <div className="flex flex-col space-y-[2vh]">
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                      </svg>
                      <input
                        type="text"
                        className="grow"
                        placeholder="First Name"
                        value={registerField.firstName}
                        onChange={(e) => {
                          setRegisterField({
                            firstName: e.target.value,
                            email: registerField.email,
                            password: registerField.password,
                          });
                        }}
                      />
                    </label>
                    {registerErrors.firstName && ( // Display email error message
                      <p className="text-red-500 text-sm mt-1">
                        {registerErrors.firstName}
                      </p>
                    )}
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                        <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                      </svg>
                      <input
                        type="email"
                        className="grow"
                        placeholder="Email"
                        value={registerField.email}
                        onChange={(e) => {
                          setRegisterField({
                            firstName: registerField.firstName,
                            email: e.target.value,
                            password: registerField.password,
                          });
                        }}
                      />
                    </label>
                    {registerErrors.email && ( // Display email error message
                      <p className="text-red-500 text-sm mt-1">
                        {registerErrors.email}
                      </p>
                    )}
                    <label className="input input-bordered flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-4 h-4 opacity-70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="password"
                        className="grow"
                        placeholder="password"
                        value={registerField.password}
                        onChange={(e) => {
                          setRegisterField({
                            firstName: registerField.firstName,
                            email: registerField.email,
                            password: e.target.value,
                          });
                        }}
                      />
                    </label>
                    {registerErrors.password && ( // Display password error message
                      <p className="text-red-500 text-sm mt-1">
                        {registerErrors.password}
                      </p>
                    )}
                    <button
                      className="btn btn-secondary w-full"
                      onClick={handleRegisterSubmit}
                    >
                      Register
                    </button>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;

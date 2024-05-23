"use client";
import { AuthenticationContext } from "@/provider/AuthContext";
import backend from "@/provider/backend";
import { todoSchema } from "@/provider/zodProvider";
import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";

type Props = {};

export type Todo = {
  note_id: string;
  user_id: string;
  note: string;
  createdAt: string;
};

const Notes = (props: Props) => {
  const [todo, setTodo] = useState("");
  const [fetchedData, setFetchedData] = useState<Todo[]>([]);
  const { isAuthenticated, userDetails, setIsAuthenticated, setUserDetails } =
    useContext(AuthenticationContext);
  const [todoError, setTodoError] = useState("");

  const fetchData = async () => {
    try {
      const response = await backend.get("/notes/");
      console.log(response.data);
      setFetchedData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    try {
      todoSchema.parse({ todo }); // Parse and validate the input

      const response = await backend.post("/notes/", {
        user_id: userDetails.id,
        note: todo,
      });
      if (response.status === 201) {
        console.log("Successfully added");
        fetchData();
        setTodo("");
        setTodoError(""); // Clear any previous errors
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setTodoError(error.errors[0].message);
      } else {
        console.error("Error submitting note:", error);
      }
    }
  };

  const handleDelete = async ({ note_id }: { note_id: string }) => {
    try {
      const response = await backend.delete("/notes/", {
        data: { note_id: note_id },
      });
      if (response.status === 204) {
        console.log("Successfully deleted");
        fetchData();
        setTodo("");
      }
    } catch (error) {}
  };

  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const profile = await backend.get("/accounts/getprofile/");
          if (profile.status === 200) {
            setUserDetails({
              email: profile.data.email,
              id: profile.data.id,
              first_name: profile.data.first_name,
            });
            setIsAuthenticated(true); // Set authentication AFTER profile is fetched
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated && userDetails.id) {
          // Fetch notes only when authenticated AND userDetails.id is available
          const response = await backend.get("/notes/");
          console.log(response.data);
          setFetchedData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData(); // This will run after the user is authenticated
  }, [isAuthenticated, userDetails.id]);

  return (
    <>
      <div className="w-[50vw] space-y-[.5vw]">
        <div className="flex flex-col items-center w-full">
          <label className="form-control items-center w-full">
            <form onSubmit={handleSubmit} className="space-x-2 flex w-full">
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full text-white"
                onChange={(e) => {
                  setTodo(e.target.value);
                  setTodoError(""); // Clear error when typing
                }}
                value={todo}
              />
              <button type="submit" className="btn btn-active btn-accent">
                Create
              </button>
            </form>
            {todoError && (
              <p className="text-red-500 text-sm mt-1">{todoError}</p>
            )}
          </label>
        </div>

        {fetchedData.map((data, index) => (
          <div key={index} className="flex flex-col w-full bg-white rounded-md">
            <div className="flex items-center space-x-[1vw] hover:bg-slate-100 mx-[1vw] my-[0.33vw] rounded-md">
              <div className="lg:tooltip" data-tip="Mark as done">
                <button className="btn btn-square btn-outline border-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width={24}
                    height={24}
                    color={"#000000"}
                    fill={"none"}
                  >
                    <path
                      d="M2.5 13.8333L6 17.5L7.02402 16.4272M16.5 6.5L10.437 12.8517"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.5 13.8333L11 17.5L21.5 6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="w-[90%]">{data.note}</p>
              <div className="lg:tooltip" data-tip="Clear">
                <button
                  className="btn btn-square btn-outline border-0"
                  onClick={() => {
                    handleDelete({ note_id: data.note_id });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Notes;

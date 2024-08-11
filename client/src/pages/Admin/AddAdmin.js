import React, { useState } from "react";
import { useAuth } from "../../store/context/LoginContext";
import { notify } from "../../store/utils/helperFunctions";
import { API } from "../../store/utils/API";
import { useQuery, useQueryClient } from "react-query";

const fetchAllAdmin = async (userid) => {
  if (!userid) return;
  try {
    const response = await API.get(`/api/v1/admin/all`, {
      headers: {
        Authorization: `Bearer ${userid}`,
      },
    });
    console.log(response.data.admins);
    return response.data.admins;
  } catch (error) {
    console.error("Error fetching article", error);
    error.error = true;
    return error.response.data;
  }
};

const AddAdmin = () => {
  const authCtx = useAuth();
  const [email, setEmail] = useState("");

  const queryClient = useQueryClient();

  const {
    data: admins,
    error,
    isLoading,
  } = useQuery(["all admins"], () => fetchAllAdmin(authCtx?.userId), {
    enabled: !!authCtx?.userId,
    retry: false,
    staleTime: 10 * 60 * 1000, // Data is considered fresh for 10 minutes
    cacheTime: 60 * 60 * 1000, // Data is considered stale after 60 minutes
  });

  const addAdmin = async () => {
    try {
      const response = await API.post(
        `/api/v1/admin`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${authCtx?.userId}`,
          },
        }
      );
      console.log(response.data);
      notify("Admin added successfully");
      setEmail("");
      queryClient.invalidateQueries("all admins");
    } catch (error) {
      console.error("Error adding admin", error);
      notify("Error adding admin");
      if (error?.response?.data?.message) {
        notify(error.response.data.message);
      }
    }
  };
  console.log(admins);
  return (
    <div className="w-full h-full p-4 flex flex-col justify-center">
      <div>
        <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
          <div className="relative w-full">
            <label
              htmlFor="email"
              className="hidden mb-2 text-sm font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <input
              className="block p-3 pl-10 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:border-transparent focus:ring-0"
              placeholder="Enter your email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              onClick={addAdmin}
              className="py-3 px-5 w-full text-sm font-medium text-center text-black-500 rounded-lg border cursor-pointer bg-blue-500 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 hover:text-white"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="m-4">
        <h1 className="text-2xl font-semibold">Admins</h1>
        <div className="flex flex-col">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error fetching admins</div>}
          {admins?.length > 0 ? (
            admins.map((admin, index) => (
              <div key={admin._id} className="">
                <div>
                  {index + 1}. &nbsp;{admin.email}
                </div>
              </div>
            ))
          ) : (
            <div>No admins found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;

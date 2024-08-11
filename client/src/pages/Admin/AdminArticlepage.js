import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../../store/utils/API";
import { formatDate, notify } from "../../store/utils/helperFunctions";
import { useAuth } from "../../store/context/LoginContext";
import { useQuery } from "react-query";
import "suneditor/dist/css/suneditor.min.css";

const fetchArticle = async (slug, userid) => {
  try {
    const response = await API.get(`/api/v1/article/${slug}/admin`, {
      headers: {
        Authorization: `Bearer ${userid}`,
      },
    });
    return response.data.article;
  } catch (error) {
    console.error("Error fetching article", error);
    error.error = true;
    return error.response.data;
  }
};

const Articlepage = () => {
  const { slug } = useParams();
  const authCtx = useAuth();
  const navigate = useNavigate();

  const {
    data: article,
    error,
    isLoading,
  } = useQuery(["article", slug], () => fetchArticle(slug, authCtx.userId), {
    retry: false,
    enabled: !!slug && !!authCtx.userId,
    staleTime: 10 * 60 * 1000, // Data is considered fresh for 10 minutes
    cacheTime: 60 * 60 * 1000, // Data is considered stale after 60 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (article?.error) {
    notify(article?.message);
    return (
      <div className="font-bold text-4xl text-center p-4 text-red-700">
        {article?.message ? article.message : "Error loading article"}
      </div>
    );
  }

  return (
    <div className="p-8 md:p-20 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-3/4">
        <div className="flex flex-row py-4">
          <div className="rounded-lg bg-red-500 text-white max-w-24 px-2 py-1 text-center">
            {article?.status?.toUpperCase()}
          </div>
          <div className="flex-grow" />
          <div
            className="rounded-lg bg-blue-500 text-white max-w-24 px-2 py-1 text-center cursor-pointer"
            onClick={() => navigate("/admin/edit-article/" + article?.slug)}
          >
            Edit
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 pb-8 border-b-2 border-black-800">
          <div className="w-full md:w-1/2 aspect-w-1 aspect-h-1">
            <img
              src={article?.coverImage}
              alt="Cover pic"
              className=" object-cover rounded-lg"
            />
          </div>
          <div className="w-full flex flex-col md:w-1/2">
            <div className="text-lg mb-2">
              {article?.date && formatDate(article?.date, 1)}
            </div>
            <div className="text-4xl md:text-5xl/[55px] font-bold mb-2">
              {article?.title}
            </div>

            <div className="flex-grow"></div>
            <div className="flex flex-wrap">
              {article?.tags &&
                article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-md bg-[#af695c] text-white px-3 py-1 rounded-full mr-2 mt-2"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: article?.content }}
          className="text-justify mt-8"
        ></div>
      </div>
      <div className="w-1/4">
        {[...Array(5)].map((_, index) => (
          <div className="w-full flex flex-row m-4">
            <div
              key={index}
              className="w-20 h-16 bg-gray-200 rounded-lg animate-pulse"
            />
            <div className="w-full bg-red-300 rounded-r-lg">hi </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DropDown = () => {
  const routes = [
    { name: "All Articles", path: "/admin/all-articles" },
    { name: "Add Article", path: "/admin/add-article" },
    { name: "Add Admin", path: "/admin/add-admin" },
  ];
  return (
    <div>
      <button
        id="dropdownNavbarLink"
        data-dropdown-toggle="dropdownNavbar"
        className="flex items-center justify-between text-black font-medium pb-1 relative"
      >
        Admin
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownNavbar"
        className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-400"
          aria-labelledby="dropdownLargeButton"
        >
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Articlepage;

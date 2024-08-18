import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API } from "../store/utils/API";
import { formatDate, notify } from "../store/utils/helperFunctions";
import "suneditor/dist/css/suneditor.min.css";
import { useQuery } from "react-query";

import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { MdOutlineChat } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import Comment from "../components/Comment";
import { useAuth } from "../store/context/LoginContext";

const fetchArticle = async (slug) => {
  try {
    const response = await API.get(`/api/v1/article/${slug}`);
    return response.data.article;
  } catch (error) {
    console.error("Error fetching article", error);
    error.error = true;
    return error.response.data;
  }
};

const Articlepage = () => {
  const authCtx = useAuth();
  const { slug } = useParams();
  const {
    data: article,
    error,
    isLoading,
  } = useQuery(["article", slug], () => fetchArticle(slug), {
    retry: false,
    enabled: !!slug, // Only fetch if slug exists
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

  const shareHandler = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article.title,
          text: article.description,
          url: `${window.location}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web share not supported");
    }
  };

  const handleScroll = () => {
    const commentsSection = document.getElementById("comments");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="p-8 md:p-20 flex flex-col gap-4"
      style={{ fontFamily: "Arial" }}
    >
      {authCtx.isAdmin && (
        <Link
          to={`/admin/article/${slug}`}
          className="absolute top-20 right-10 hover:text-blue-400 hover:underline"
        >
          Go to Admin Article Page
        </Link>
      )}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col md:flex-row gap-4 pb-8 border-b-2 border-black-800">
            <div className="w-full md:w-1/2 max-h-1/2 relative">
              <img
                src={article.coverImage}
                alt="Cover pic"
                className=" object-fill   rounded-lg h-full"
              />

              <div className="absolute bottom-0 p-2 flex flex-row gap-4">
                <div>
                  <FaRegThumbsUp
                    color="white"
                    size={24}
                    className="hover:fill-blue-500"
                  />
                  {/* <FaThumbsUp
                  color="white"
                  size={24}
                  className="hover:fill-blue-500"
                /> */}
                </div>
                <MdOutlineChat
                  color="white"
                  size={24}
                  className="hover:fill-blue-500"
                  onClick={handleScroll}
                />
                <FaShareAlt
                  color="white"
                  size={24}
                  className="hover:fill-blue-500"
                  onClick={shareHandler}
                />
              </div>
            </div>
            <div className="w-full flex flex-col md:w-1/2">
              <div className="text-lg mb-2">
                {article?.date && formatDate(article.date, 1)}
              </div>
              <div className="text-4xl md:text-5xl/[55px] font-bold mb-2">
                {article.title}
              </div>

              <div className="flex-grow"></div>
              <div className="flex flex-wrap">
                {article.tags &&
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
            className="sun-editor-editable"
            style={{ backgroundColor: "#f9f4ed" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="text-justify mt-8 "
            ></div>
          </div>
        </div>
        <div className="lg:w-1/4">
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

      <div className="w-full">
        <Comment articleId={article?._id} />
      </div>
    </div>
  );
};

export default Articlepage;

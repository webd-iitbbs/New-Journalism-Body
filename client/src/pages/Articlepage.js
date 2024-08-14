import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API } from "../store/utils/API";
import { formatDate, notify } from "../store/utils/helperFunctions";
import "suneditor/dist/css/suneditor.min.css";
import { useQuery } from "react-query";
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

  return (
    <div
      className="p-8 md:p-20 flex flex-col lg:flex-row gap-4"
      style={{ fontFamily: "Arial" }}
    >
      <div className="w-full lg:w-3/4">
        <div className="flex flex-col md:flex-row gap-4 pb-8 border-b-2 border-black-800">
          <div className="w-full md:w-1/2 aspect-w-1 aspect-h-1">
            <img
              src={article.coverImage}
              alt="Cover pic"
              className=" object-cover rounded-lg"
            />
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

export default Articlepage;

import React from 'react';
import { Link } from 'react-router-dom';
import { BiUpvote } from "react-icons/bi";
const ArticleCard = ({ article }) => {
  console.log(article);
  const getPlainText = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    return doc.body.innerText; // Get the text content
  };
  return (
    <div className="w-full sm:w-2/3 md:w-full mx-auto">

      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden hover:scale-[1.01] hover:shadow-[10px_15px_15px_5px_rgba(0,0,0,0.3)]">
        <div className=" flex justify-center items-center  lg:h-72 md:h-64 sm:h-48">
          <img
            className=" w-full lg:h-72 md:h-64  object-center sm:h-48"
            src={article.coverImage || "https://dummyimage.com/720x400"}
            alt="blog"
          />
        </div>
        <div className="p-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-3">{article.category}</h2>
          <h1 className="title-font text-lg font-medium text-black mb-3">{article.title}</h1>
          <p className="leading-relaxed mb-3">
            {getPlainText(article.content).substring(0, 100)}...
          </p>
          <div className="flex items-center flex-wrap">
            <Link className="text-indigo-400 inline-flex items-center md:mb-2 lg:mb-0 cursor-pointer"
              to={`/article/${article.slug}`}
            >
              Read more
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
            <span className="text-gray-500 mr-3 inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-sm pr-3 py-1 border-r-2 border-gray-800">
              <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>{article.views}
            </span>
            <span className="text-gray-500 inline-flex items-center leading-none text-sm">
              <BiUpvote className="w-4 h-4 mr-1" />

              {/* <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
              </svg> */}
              {article.upVotes.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;

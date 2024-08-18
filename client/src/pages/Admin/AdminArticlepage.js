import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../../store/utils/API";
import { formatDate, notify } from "../../store/utils/helperFunctions";
import { useAuth } from "../../store/context/LoginContext";
import { useQuery } from "react-query";
import "suneditor/dist/css/suneditor.min.css";
import PuffLoader from "react-spinners/PuffLoader";
import Comment from "../../components/Comment";

const fetchArticle = async (slug, token) => {
  try {
    const response = await API.get(`/api/v1/article/${slug}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
  const [articleStatus, setArticleStatus] = useState("");
  const {
    data: article,
    // error,
    isLoading,
  } = useQuery(
    ["article", slug],
    () => fetchArticle(slug, authCtx.AccessToken),
    {
      retry: false,
      enabled: !!slug && !!authCtx.userId,
      staleTime: 10 * 60 * 1000, // Data is considered fresh for 10 minutes
      cacheTime: 60 * 60 * 1000, // Data is considered stale after 60 minutes
    }
  );

  useEffect(() => {
    if (article) {
      if (article.error) return notify(article.message);
      console.log(article.status);
      setArticleStatus(article.status);
    }
  }, [article, article?.status]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 flex-grow">
        <PuffLoader color="#f1c40f" loading={isLoading} size={150} />
      </div>
    );
  }
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
      className="p-8 md:p-20 flex flex-col gap-4"
      style={{ fontFamily: "Arial" }}
    >
      <Link
        to={`/article/${slug}`}
        className="absolute top-20 right-10 hover:text-blue-400 hover:underline"
      >
        Go to normal user Article Page
      </Link>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-3/4">
          <div className="flex flex-row py-4">
            <div>
              <DropDown
                article={article}
                status={articleStatus}
                setArticleStatus={setArticleStatus}
              />
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
            className="sun-editor-editable"
            style={{ backgroundColor: "#f9f4ed" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: article?.content }}
              className="text-justify mt-8"
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

      <div className="w-full">
        <Comment articleId={article?._id} />
      </div>
    </div>
  );
};
const DropDown = ({ article, status, setArticleStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(status);
  const authCtx = useAuth();

  const routes = ["draft", "published", "archived", "deleted"].filter(
    (route) => route !== selected?.toLowerCase()
  );

  useEffect(() => {
    setSelected(status);
  }, [status]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const changeArticleStatus = async (status) => {
    if (!authCtx?.userId) return notify("Please login to continue");
    if (!selected) return notify("Please select an article status");
    try {
      const response = await API.patch(
        `/api/v1/article/admin/update-status`,
        { slug: article.slug, status },
        {
          headers: {
            Authorization: `Bearer ${authCtx?.AccessToken}`,
          },
        }
      );
      console.log(response.data);
      notify("Article status updated successfully");
      setArticleStatus(status);
      setSelected(status);
    } catch (error) {
      console.error("Error updating article status", error);
      notify("Error updating article status");
      if (error?.response?.data?.message) {
        notify(error.response.data.message);
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-row gap-2">
        <button
          id="dropdownArticleAdminLink"
          onClick={handleToggle}
          className="flex items-center justify-between text-black font-medium pb-1 relative rounded-lg bg-red-500 text-white max-w-48 px-2 py-1 text-center"
        >
          {selected?.toUpperCase()}

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

        {selected !== status && (
          <button
            onClick={() => changeArticleStatus(selected)}
            className="text-base text-white bg-blue-500 px-1 py-1 min-w-36 text-center rounded-full"
          >
            Save changes
          </button>
        )}
      </div>

      <div
        id="dropdownArticleAdmin"
        className={`absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-400"
          aria-labelledby="dropdownLargeButton"
        >
          {routes.map((route) => (
            <li key={route}>
              <button
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  setSelected(route);
                  setIsOpen(false);
                }}
              >
                {route}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Articlepage;

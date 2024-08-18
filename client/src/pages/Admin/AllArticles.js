import React, { useEffect, useState } from "react";
import { API } from "../../store/utils/API";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/context/LoginContext";
import { notify } from "../../store/utils/helperFunctions";
import { Table, Button, Tag } from "antd";
import { formatDate } from "../../store/utils/helperFunctions";

import PuffLoader from "react-spinners/PuffLoader";

const fetchAllArticle = async (token) => {
  try {
    const response = await API.get(`/api/v1/article/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching article", error);
    error.error = true;
    return error.response.data;
  }
};

const AllArticles = () => {
  const authCtx = useAuth();
  const userid = authCtx.userId;
  const [checked, setChecked] = useState([
    "published",
    "draft",
    "archived",
    "deleted",
  ]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [mode, setMode] = useState("table"); // default or table

  const {
    data: articles,
    // error,
    isLoading,
  } = useQuery(
    ["all articles admin"],
    () => fetchAllArticle(authCtx.AccessToken),
    {
      enabled: !!authCtx.AccessToken,
      retry: false,
    }
  );

  useEffect(() => {
    if (articles) {
      if (articles.error) {
        return notify(articles.message);
      }
      if (checked.length > 0) {
        setFilteredArticles(
          articles.filter((article) => checked.includes(article.status))
        );
      } else {
        setFilteredArticles(articles);
      }
    }
  }, [checked, articles]);

  useEffect(() => {
    if (articles) {
      setFilteredArticles(articles);
    }
  }, [articles]);

  return (
    <div className="w-full sm:p-4">
      <div className="w-[200px] mb-4 flex justify-between items-center">
        <Button
          onClick={() => setMode("default")}
          type={mode === "default" ? "default" : "text"}
        >
          Cards View
        </Button>
        <Button
          onClick={() => setMode("table")}
          type={mode === "table" ? "default" : "text"}
        >
          Table View
        </Button>
      </div>

      <div className="p-4 font-medium">
        Only Published article will be shown to normal user
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-96 flex-grow">
          <PuffLoader color="#f1c40f" loading={isLoading} size={150} />
        </div>
      )}
      {mode === "default" && (
        <>
          <Filter checked={checked} setChecked={setChecked} />

          <div className="flex flex-row flex-wrap gap-4">
            {filteredArticles.length > 0 &&
              filteredArticles?.map((article) => <Card article={article} />)}
          </div>
        </>
      )}

      {mode === "table" && <ArticleTable articles={articles} />}
    </div>
  );
};

const Card = ({ article }) => {
  return (
    <div className="max-w-[250px] m-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="relative">
        <img className="rounded-t-lg" src={article.coverImage} alt="ci" />
        <div className="absolute top-0 right-0 bg-blue-700 text-white px-2 py-1 rounded-bl-lg">
          {article.status}
        </div>
      </div>
      <div className="p-5">
        <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {article.title}
        </h5>

        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
          Slug: {article.slug}
        </p>
        <p className="mb-1 font-normal text-gray-700 dark:text-gray-400">
          {article.category}
        </p>

        <Link
          to={`/admin/article/${article.slug}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const Filter = ({ checked, setChecked }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ["published", "draft", "archived", "deleted"];

  const handleCheckboxChange = (option) => {
    setChecked((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative p-2">
      <button
        id="dropdownCheckboxButton"
        onClick={handleToggle}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Filter{" "}
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        id="dropdownDefaultCheckbox"
        className={`absolute z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul
          className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownCheckboxButton"
        >
          {options.map((option, index) => {
            const isChecked = checked.includes(option);
            return (
              <li key={index}>
                <div className="flex items-center">
                  <input
                    id={`checkbox-item-${index}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(option)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label
                    htmlFor={`checkbox-item-${index}`}
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {option.toLocaleUpperCase()}
                  </label>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const ArticleTable = ({ articles }) => {
  const [articleswithKey, setArticleswithKey] = useState(null);

  useEffect(() => {
    if (articles) {
      articles.forEach((article, index) => {
        article.key = index;
      });
      setArticleswithKey(articles);
    }
  }, [articles]);

  if (!articles) return null;

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      render: (date) => formatDate(date, 2),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
        { text: "Archived", value: "archived" },
        { text: "Deleted", value: "deleted" },
      ],
      onFilter: (value, record) => record.status.includes(value),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link to={`/admin/article/${record.slug}`} className="text-blue-700">
          Read More
        </Link>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const innerColumns = [
      {
        title: "Name",
        dataIndex: ["userId", "name"],
        key: "name",
      },
      {
        title: "Modification",
        dataIndex: "modification",
        key: "modification",
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (date) => formatDate(date, 2),
      },
      {
        title: "Email",
        dataIndex: ["userId", "email"],
        key: "email",
      },
    ];

    return (
      <Table
        columns={innerColumns}
        dataSource={record.addedOrUpdatedBy}
        pagination={false}
      />
    );
  };

  return (
    <div className="p-4">
      <Table
        columns={columns}
        dataSource={articleswithKey}
        expandable={{
          expandedRowRender: expandedRowRender,
          rowExpandable: (record) => record.addedOrUpdatedBy.length > 0,
        }}
        pagination={{ pageSize: 20 }}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default AllArticles;

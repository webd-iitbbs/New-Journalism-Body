import React, { useState, useEffect, useCallback } from "react";
import Editor from "./../../components/Editor.tsx";
import Modal from "react-modal";
import { API } from "../../store/utils/API";
import { notify, uploadHandlerServer } from "../../store/utils/helperFunctions";
import debounce from "lodash/debounce";
import { useAuth } from "../../store/context/LoginContext";
import { useNavigate } from "react-router-dom";

const AddArticle = () => {
  const authCtx = useAuth();
  const userid = authCtx.userId;
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState(null); // contains blob of image
  const [coverImage1, setCoverImage1] = useState(null); // contains image

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [tags, setTags] = useState([]);
  const [tagInputValue, setTagInputValue] = useState("");

  const [slug, setSlug] = useState("");
  const [slugAvailable, setSlugAvailable] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setTagInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addTag(tagInputValue);
    }
  };

  const handleBlur = () => {
    addTag(tagInputValue);
  };

  const addTag = (tag) => {
    if (tag.trim() !== "" && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
    }
    setTagInputValue("");
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setCoverImage1(e.target.files[0]);
      const file = URL.createObjectURL(e.target.files[0]);
      setCoverImage(file);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const debouncedCheckSlugAvailability = useCallback(
    debounce(async (slug) => {
      if (slug) slug = slug.toLowerCase().split(" ").join("-");
      try {
        const res = await API.get(`/api/v1/article/slug-availability`, {
          params: { slug },
        });
        console.log(res.data);
        setSlugAvailable(res.data.available);
        if (!res.data.available) {
          notify("Slug is not available");
        }
      } catch (err) {
        console.log(err);
      }
    }, 500), // Adjust debounce delay as needed
    []
  );

  useEffect(() => {
    if (slug) {
      debouncedCheckSlugAvailability(slug);
    }
  }, [slug, debouncedCheckSlugAvailability]);

  const handleSave = async () => {
    let body = {};

    if (
      !slug ||
      !title ||
      !content ||
      !category ||
      !coverImage ||
      tags.length === 0
    ) {
      setErrorMessage("Please fill all the fields");
      return;
    }

    if (coverImage1) {
      const url = await uploadHandlerServer(coverImage1);
      if (url) {
        body.coverImage = url;
      } else {
        notify("Error uploading image");
        return;
      }
    }
    body.slug = slug.trim();
    body.title = title.trim();
    body.content = content.trim();
    body.category = category.trim();
    body.tags = tags;
    body.date = new Date(date).toISOString();
    console.log(body);
    setLoading(true);
    // API call to save the article
    try {
      const res = await API.post(`/api/v1/article/admin`, body, {
        headers: {
          Authorization: `Bearer ${authCtx.AccessToken}`,
        },
      });
      console.log(res.data);
      notify("Article saved successfully");
      navigate(`/admin/article/${body.slug.toLowerCase()}`); // Redirect to the saved article page
      // Redirect to the saved article page
      notify(
        "Change Status from Draft to Published to make the article live on the website"
      );
    } catch (err) {
      console.log(err);
      setErrorMessage("Error saving article");
      if (err?.response?.data?.message) {
        setErrorMessage(err.response.data.message);
        notify(err.response.data.message);
      }
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="p-4 b-2 sm:p-12">
      {errorMessage && (
        <div className="text-red-700 font-bold text-2xl text-center p-4 hover:text-red-800">
          {errorMessage}
        </div>
      )}
      {/* Slug */}
      <div className="mb-6 max-w-[600px]">
        <button
          data-tooltip-target="tooltip-slug"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Slug (URL friendly version of the article name)
        </button>
        <div
          id="tooltip-slug"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          A URL slug refers to the end part of a URL after the backslash (“/”)
          that identifies the specific page or post.
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <input
          type="text"
          id="success"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. my-first-article or nirf-ranking-2023"
        />
        <p className="mt-1 text-sm text-red-800">
          {slug && (
            <>
              <span className="font-medium">Slug availability</span>{" "}
              {slugAvailable ? "✅" : "❌"}
            </>
          )}
        </p>
      </div>

      {/* Title */}
      <div className="mb-6 max-w-[600px]">
        <label
          data-tooltip-target="tooltip-title"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Title (Name of the article)
        </label>

        <input
          type="text"
          id="success"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. Rankings Of IITBBS: A Wake Up Call"
        />
      </div>

      {/* Cover Image */}
      <div className="mb-6 max-w-[600px]">
        <label
          data-tooltip-target="tooltip-cover-image"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Cover Image (Image that will be displayed on the article card)
        </label>

        <input
          type="file"
          accept="image/*"
          id="success"
          className="border border-green-500  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full "
          placeholder="eg. Rankings Of IITBBS: A Wake Up Call"
          onChange={handleImageChange}
        />
        {coverImage && (
          <div className="mt-2">
            <img
              src={coverImage}
              alt="Selected preview"
              className="mb-6 w-32 h-32 object-cover cursor-pointer"
              onClick={openModal}
            />
            {modalIsOpen && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  contentLabel="Image Modal"
                  className="modal"
                  style={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.75)",
                    },
                  }}
                >
                  <div className="pt-20 h-[200px]">
                    <button
                      onClick={closeModal}
                      className="close-button text-white font-bold m-2"
                    >
                      Close
                    </button>
                    <div className="flex justify-center items-center overflow-hidden">
                      <img
                        src={coverImage}
                        alt="Full Size"
                        className="full-size-image max-w-md"
                        style={{ overflowY: "scroll", scrollbarWidth: "none" }}
                      />
                    </div>
                  </div>
                </Modal>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category */}
      <div className="mb-6 max-w-[600px]">
        <button
          data-tooltip-target="tooltip-category"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Category (Category of the article)
        </button>
        <div
          id="tooltip-category"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Category refers to the topic or subject matter of the article. Eg.
          Student Life, Academics, Research, etc.
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <input
          type="text"
          id="success"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. Student Life, Academics, Technology, Alumni, Career etc"
        />
      </div>

      {/* Tags */}
      <div className="mb-6 max-w-[600px]">
        <button
          data-tooltip-target="tooltip-tags"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Tags (Tags of the article)
        </button>
        <div
          id="tooltip-tags"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Tags refers to the keywords or phrases that describe the article. Eg.
          IITBBS, Rankings, NIRF, 2023, etc. Enter tags separated by space.
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <input
          type="text"
          id="success"
          value={tagInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. IITBBS NIRF-2024"
        />
        <div className="mt-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="bg-blue-700 text-white rounded-full p-1 text-xs flex items-center justify-center"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="mb-6 max-w-[600px]">
        <button
          data-tooltip-target="tooltip-date"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Date (Date of the article)
        </button>
        <div
          id="tooltip-date"
          role="tooltip"
          className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
        >
          Date to be displayed on the article card.
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
        <input
          type="date"
          id="success"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-green-500 text-black  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
          placeholder="eg. Student Life, Academics, Technology, Alumni, Career etc"
        />
      </div>

      {/* Content Editor */}

      <div className="mb-6 w-full">
        <label
          data-tooltip-target="tooltip--editor"
          type="button"
          for="success"
          className="block mb-1 text-sm font-medium text-black"
        >
          Content Editor
        </label>
        {!modalIsOpen && (
          <Editor onChange={setContent} initialContent={content} />
        )}
      </div>

      <div className="flex items-center justify-center">
        <button
          onClick={handleSave}
          className={`w-64 bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-600 ${
            loading && "cursor-not-allowed opacity-50 disabled"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddArticle;

// slug
// title
// content
// category
// coverImage
// tags

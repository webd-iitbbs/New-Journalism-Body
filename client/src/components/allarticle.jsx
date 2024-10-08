import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../store/utils/API';
import { IoIosSearch } from "react-icons/io";

const Allarticle = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const limit = searchParams.get("limit") || 6;
    const page = searchParams.get("page") || 1;

    let articletoSearch = searchParams.get("article") || "recent";
    articletoSearch = articletoSearch.trim();
    const [articles, setArticles] = useState([]);

    const [fetchedArticles, setFetchedArticles] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(articletoSearch);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    const categories = ["Student Life", "Entertaiment", "Ghymkhana", "Education"];
    useEffect(() => {
        const validArticles = ["recent", "most-read", "trending", "category"];
        if (!validArticles.includes(selectedCategory)) {
            // navigate("/?article=recent&limit=5");
            setSelectedCategory("recent");
            return;
        }
        if (fetchedArticles[selectedCategory]) {
            setArticles(fetchedArticles[selectedCategory]);
            return;
        }
        const fetchArticles = async () => {
            try {
                const response = await API.get(`/api/v1/article-stats/${selectedCategory}?limit=${limit}&page=${page}`);
                setArticles(response.data.articles);
                setFetchedArticles({ ...fetchedArticles, [selectedCategory]: response.data.articles });
                console.log(response.data.articles);
            } catch (error) {
                console.error("Error fetching articles", error);
            }
        };

        fetchArticles();
    }, [selectedCategory, limit]);

    const handleCategoryChange = (category) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
        }
    };
    const gotopage = (pageinput) => {
        const newPage = parseInt(page) + pageinput;
        if (newPage < 1) return;
        navigate(`/articles?article=${selectedCategory}&limit=${limit}&page=${newPage}`);
    }
    console.log(fetchedArticles);
    return (
        <div className="p-8 min-h-screen bg-[#F9F4ED]">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-1/3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 border rounded-lg text-gray-600 "
                    />
                    <button className="absolute align-center right-2 top-3 text-gray-600">
                        <IoIosSearch className="h-5 w-5 " />
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button className={`px-4 py-2 text-white rounded-md w-full sm:w-auto ${selectedCategory === "recent" ? "bg-[#f06f55]" : "bg-[#A55242]"}`}
                        onClick={() => { setSelectedCategory("recent") }}
                    >
                        Recent
                    </button>
                    <button className={`px-4 py-2 text-white rounded-md w-full sm:w-auto ${selectedCategory === "trending" ? "bg-[#f06f55]" : "bg-[#A55242]"}`}
                        onClick={() => { setSelectedCategory("trending") }}
                    >
                        Trending
                    </button>
                    <button className={`px-4 py-2 text-white rounded-md w-full sm:w-auto ${selectedCategory === "most-read" ? "bg-[#f06f55]" : "bg-[#A55242]"}`}
                        onClick={() => { setSelectedCategory("most-read") }}
                    >
                        Most Read
                    </button>
                    <div className="relative w-full sm:w-auto">
                        <button
                            className="px-4 py-2 bg-[#A55242] text-white rounded-md w-full sm:w-auto flex items-center justify-center text-center"
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        >
                            Categories {isCategoryDropdownOpen ? <FaChevronDown className="ml-2" /> : <FaChevronRight className="ml-2" />}
                        </button>
                        {isCategoryDropdownOpen && (
                            <div className="absolute mt-2 bg-white shadow-lg rounded-md w-full sm:w-auto z-10">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10  mt-3">
                {!articles.length && (
                    <div className="text-2xl text-center">No articles found</div>
                )}
                {articles.map((article) => (
                    <ArticleCard key={article._id} article={article} />
                ))}

            </div>

            <div className="flex justify-center gap-4 mt-24">
                {articles.length > 0 && <div class="flex" >
                    {parseInt(page) !== 1 && <button href="#" class="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => { gotopage(-1) }}                    >
                        <svg class="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                        </svg>
                        Previous
                    </button>}
                    <button href="#" class="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        onClick={() => { gotopage(1) }}     >
                        Next
                        <svg class="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </button>
                </div>}
            </div>
        </div >
    );
};

export default Allarticle;

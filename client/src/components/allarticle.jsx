import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../store/utils/API';
const Allarticle = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const limit = searchParams.get("limit") || 6;
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
                const response = await API.get(`/api/v1/article-stats/${selectedCategory}?limit=${limit}`);
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
    console.log(fetchedArticles);
    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full sm:w-1/3">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full px-4 py-2 border rounded-lg text-gray-600 "
                    />
                    <button className="absolute right-2 top-2 text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L21 20"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button className="px-4 py-2 bg-black text-white rounded-md w-full sm:w-auto">
                        Recent
                    </button>
                    <button className="px-4 py-2 bg-gray-200 rounded-md w-full sm:w-auto">
                        Trending
                    </button>
                    <button className="px-4 py-2 bg-gray-200 rounded-md w-full sm:w-auto">
                        Most Read
                    </button>
                    <div className="relative w-full sm:w-auto">
                        <button
                            className="px-4 py-2 bg-gray-200 rounded-md w-full sm:w-auto flex items-center justify-center text-center"
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
        </div>
    );
};

export default Allarticle;

import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API } from '../store/utils/API';
import { motion } from 'framer-motion';

const Articles = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const limit = searchParams.get("limit") || 6;
    let articletoSearch = searchParams.get("article") || "recent";
    articletoSearch = articletoSearch.trim();
    const [articles, setArticles] = useState([]);
    const [fetchedArticles, setFetchedArticles] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(articletoSearch);

    useEffect(() => {
        const validArticles = ["recent", "most-read", "trending", "category"];
        if (!validArticles.includes(selectedCategory)) {
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

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1, // Staggered delay for each card
            },
        }),
    };

    const categoryVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <div className='min-h-screen bg-white flex flex-col' id="articles">
            <div className='p-4 md:px-20 text-6xl font-black border-b-4 border-black' style={{ fontFamily: 'monospace' }}>
                Articles
            </div>
            <div className='p-4 md:px-8 flex flex-col md:flex-row gap-8 mt-8 lg:gap-16 '>
                {/* Sidebar */}
                <motion.div
                    className='lg:w-1/4'
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Trigger once when 50% of the element is in view
                    variants={categoryVariants}
                >
                    <div className='bg-[#2A2A2A] text-white rounded-lg p-6 shadow-lg sm:sticky sm:top-20 w-full sm:w-2/3 md:w-full mx-auto'>
                        <div className='text-2xl py-4 border-b border-gray-500 flex justify-between items-center cursor-pointer' onClick={() => handleCategoryChange('recent')}>
                            <span>Recent Articles</span>
                            <div className='pt-2'>
                                {selectedCategory === 'recent' ? <FaChevronDown className='text-gray-400' /> : <FaChevronRight className='text-gray-400' />}
                            </div>
                        </div>
                        <div className='text-2xl py-4 border-b border-gray-500 flex justify-between items-center cursor-pointer' onClick={() => handleCategoryChange('trending')}>
                            <span>Trending News</span>
                            <div className='pt-2'>
                                {selectedCategory === 'trending' ? <FaChevronDown className='text-gray-400' /> : <FaChevronRight className='text-gray-400' />}
                            </div>
                        </div>
                        <div className='text-2xl py-4 border-b border-gray-500 flex justify-between items-center cursor-pointer' onClick={() => handleCategoryChange('most-read')}>
                            <span>Most Read</span>
                            <div className='pt-2'>
                                {selectedCategory === 'most-read' ? <FaChevronDown className='text-gray-400' /> : <FaChevronRight className='text-gray-400' />}
                            </div>
                        </div>
                        <div className='text-2xl py-4 flex justify-between items-center cursor-pointer' onClick={() => handleCategoryChange('category')}>
                            <span>Categories</span>
                            <div className='pt-2'>
                                {selectedCategory === 'category' ? <FaChevronDown className='text-gray-400' /> : <FaChevronRight className='text-gray-400' />}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Article Cards */}
                <motion.div
                    className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }} // Animate when 10% of container is in view
                >
                    {!articles.length && (
                        <motion.div className="text-2xl text-center" variants={categoryVariants}>
                            No articles found
                        </motion.div>
                    )}
                    {articles.map((article, index) => (
                        <motion.div
                            key={article._id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }} // Animate once when 10% of the article card is visible
                        >
                            <ArticleCard article={article} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Articles;

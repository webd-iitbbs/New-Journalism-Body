import React, { useState, useEffect } from 'react';
import { formatDate, notify } from '../store/utils/helperFunctions';
import { API } from '../store/utils/API';
import { useAuth } from '../store/context/LoginContext';
import { useQuery } from 'react-query';
import { AiOutlineLike, AiTwotoneLike, AiOutlineDislike, AiTwotoneDislike } from "react-icons/ai";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
// Component for individual comment
const SingleComment = ({ comment, userId, setAllComments, authCtx }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [liked, setLiked] = useState(comment?.likes?.includes(userId));
    const [disliked, setDisliked] = useState(comment?.dislikes?.includes(userId));

    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
    };


    const likedislikeHandler = async (type) => {
        if (!userId) {
            return notify('Please login to like/dislike comment');
        }
        const data = {
            commentId: comment._id,
            userId,
            like: type
        };
        console.log(data);
        try {
            const resp = await API.patch('/api/v1/comment/like-dislike', data);
            console.log(resp.data);
            setAllComments(prev => prev.map(c => {
                if (c._id === comment._id) {
                    return {
                        ...c,
                        likes: resp.data.comment.likes,
                        dislikes: resp.data.comment.dislikes
                    };
                }
                return c;
            }));
        }
        catch (error) {
            console.error('Error liking/disliking comment', error);
            if (error?.response?.data?.message) {
                notify(error.response.data.message);
            } else {
                notify('Something went wrong. Please try again');
            }
        }
    };

    const blockComment = async () => {
        if (!authCtx.isAdmin) {
            return notify('You are not authorized to block comments');
        }

        try {
            const resp = await API.post('/api/v1/comment/admin', { commentId: comment._id }, {
                headers: {
                    Authorization: `Bearer ${authCtx.userId}`
                }
            });
            console.log(resp.data);
            setAllComments(prev => prev.filter(c => c._id !== comment._id));
            notify('Comment blocked successfully', 'success');
        }
        catch (error) {
            console.error('Error blocking comment', error);
            if (error?.response?.data?.message) {
                notify(error.response.data.message);
            } else {
                notify('Something went wrong. Please try again');
            }
        }
    };




    const likedHandler = async () => {
        likedislikeHandler('like');
        setLiked(true);
        setDisliked(false);
    }
    const dislikeHandler = async () => {
        likedislikeHandler('dislike');
        setDisliked(true);
        setLiked(false);
    }
    return (
        <article className="p-6 bg-white rounded-lg shadow-md relative">
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <img
                        className="w-6 h-6 rounded-full mr-2"
                        src={comment?.userId?.profileImage}
                        alt={comment?.userId?.profileImage}
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">{comment?.userId?.name}</p>
                        <p className="text-sm text-gray-600">{formatDate(comment.date, 1)}</p>
                    </div>
                </div>
                {authCtx.isAdmin && <button
                    onClick={toggleDropdown}
                    className="p-2 text-gray-500 bg-white rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200"
                >
                    <svg
                        className="w-4 h-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 3"
                    >
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                    </svg>
                    <span className="sr-only">Comment settings</span>
                </button>}

            </footer>
            <p className="text-gray-600">
                {comment?.content}
            </p>
            <div className="flex items-center mt-4 space-x-4">
                <button className="flex items-center text-sm text-gray-500 hover:text-blue-600" onClick={likedHandler}>
                    {!liked ? <AiOutlineLike className="w-4 h-4 mr-1" /> : <AiTwotoneLike className="w-4 h-4 mr-1" />}
                    {comment?.likes?.length}   Like
                </button>

                <button className="flex items-center text-sm text-gray-500 hover:text-red-600" onClick={dislikeHandler}>
                    {!disliked ? <AiOutlineDislike className="w-4 h-4 mr-1" /> : <AiTwotoneDislike className="w-4 h-4 mr-1" />}
                    {comment?.dislikes?.length}  Dislike
                </button>

            </div>
            {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-36 bg-white rounded shadow-md divide-y divide-gray-100">
                    <ul className="py-1 text-sm text-gray-700">
                        <li onClick={blockComment}>
                            Block this comment
                        </li>
                    </ul>
                </div>
            )}
        </article>
    );
};

const fetchComments = async (articleId) => {
    if (!articleId) {
        return;
    }
    try {
        const resp = await API.get(`/api/v1/comment?articleId=${articleId}`);
        return resp.data;
    }
    catch (error) {
        error.error = true;
        return error;
    }
};

// Main Comment component
const Comment = ({ articleId }) => {
    const authCtx = useAuth();
    const commentsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const [inputComment, setInputComment] = useState('');
    const [allComments, setAllComments] = useState([]);

    const { data, isLoading, isError } = useQuery(['comments', articleId], () => fetchComments(articleId), {
        enabled: !!articleId,
        retry: false,
        staleTime: 10 * 60 * 1000, // Data is considered fresh for 10 minutes
        cacheTime: 60 * 60 * 1000, // Data is considered stale after 60 minutes
    });

    useEffect(() => {
        if (data?.comments) {
            setAllComments(data.comments);
        }
        if (data?.APIerror) {
            notify('Error fetching comments');
        }
    }, [data]);

    console.log(data);
    // Calculate which comments to display


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const postCommentHandler = async (e) => {
        e.preventDefault();
        if (!authCtx.isLoggedIn) {
            return notify('Please login to post a comment');
        }
        if (inputComment.trim().length === 0) {
            return notify('Please enter a comment');
        }
        const comment = {
            articleId,
            content: inputComment?.trim(),
            userId: authCtx.userId
        };
        try {
            const resp = await API.post('/api/v1/comment', comment);
            console.log(resp.data);
            notify('Comment posted successfully', 'success');
            setInputComment('');
            setAllComments(prev => [resp.data.comment, ...prev]);
        }
        catch (error) {
            console.error('Error posting comment', error);
            if (error?.respnse?.data?.message) {
                notify(error.response.data.message);
            } else {
                notify('Something went wrong. Please try again');
            }
        }
    }

    const startIndex = (currentPage - 1) * commentsPerPage;
    const currentComments = allComments.slice(startIndex, startIndex + commentsPerPage);
    const totalPages = Math.ceil(allComments.length / commentsPerPage);



    return (
        <section className="py-8 lg:py-16 w-full" id="comments">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900">Comments ({allComments.length})</h2>
                </div>
                <form className="mb-6" onSubmit={postCommentHandler}>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg border border-gray-200">
                        <label htmlFor="comment" className="sr-only">Your comment</label>
                        <textarea
                            id="comment"
                            rows="6"
                            className="w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none"
                            placeholder="Write a comment..."
                            required
                            value={inputComment}
                            onChange={(e) => setInputComment(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 "
                    >
                        Post comment
                    </button>
                </form>
                <div className="space-y-6">
                    {currentComments.map(comment => (
                        <SingleComment key={comment.id} comment={comment} userId={authCtx.userId} setAllComments={setAllComments} authCtx={authCtx} />
                    ))}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center mt-6">
                    {totalPages > 1 && (
                        <>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-800 disabled:opacity-30"
                                disabled={currentPage <= 1}
                            >
                                <CiCircleChevLeft size={24} />
                            </button>
                            <span className="mx-4 text-gray-900">Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-4 py-2 bg-primary-700 rounded-lg hover:bg-primary-800 disabled:opacity-30"
                                disabled={currentPage >= totalPages}
                            >
                                <CiCircleChevRight size={24} />

                            </button>
                        </>
                    )}
                </div>

            </div>
        </section>
    );
};

export default Comment;

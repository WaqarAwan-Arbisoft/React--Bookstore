import { Pagination } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FeedCard from "../components/feed-card";
import Loader from "../components/loader";
import { FEED_POSTS_LIMIT } from "../constant/paginations";

const Feed = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const authStates = useSelector(states => states.auth);
    const [feeds, setFeeds] = useState([])
    const [count, setCount] = useState(0);

    //* Helper functions for this page
    const fetchFeed = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/fetch-feed/?limit=${FEED_POSTS_LIMIT}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setFeeds([...respData.results])
            setIsLoaded(true)
            setCount(Math.ceil(respData.count / FEED_POSTS_LIMIT))
        }
        else {
            setFeeds([])
            setIsLoaded(true)
            setCount(0)
        }
    }
    const paginationHandler = async (e) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/fetch-feed/?limit=${FEED_POSTS_LIMIT}&offset=${FEED_POSTS_LIMIT * (parseInt(e.target.innerText) - 1)}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        let respData;
        if (response.ok) {
            respData = await response.json();
            setFeeds([...respData.results])
            setCount(Math.ceil(respData.count / FEED_POSTS_LIMIT))
            setIsLoaded(true)
        }
        else {
            setFeeds([])
            setCount(0)
            setIsLoaded(true)
        }
    }
    //* Helper functions for this page

    useEffect(() => {
        fetchFeed();
    }, [])
    return (
        <div>
            <h1 className="text-center m-4 text-muted">Latest from your friends</h1>
            {!isLoaded && <div className="text-center m-4">
                <Loader width='100' height='100' />
            </div>}
            {isLoaded && feeds.length > 0 && (
                <div className="container mx-auto">
                    {feeds.map((feed, index) => (
                        <FeedCard key={index} feed={feed} />
                    ))}
                    <div className="d-flex justify-content-center my-4">
                        {count !== 0 && <Pagination hideNextButton={true} hidePrevButton={true} count={count} onClick={paginationHandler} />}
                    </div>
                </div>
            )}
            {isLoaded && feeds.length === 0 && (
                <h2 className="text-center m-4">No Feed available.</h2>
            )}

        </div>
    )
}

export default Feed;
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FeedCard from "../components/feed-card";
import Loader from "../components/loader";

const Feed = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const authStates = useSelector(states => states.auth);
    const [feeds, setFeeds] = useState([])
    const fetchFeed = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/social/fetch-feed/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + authStates.token
            }
        })
        if (response.ok) {
            let respData = await response.json()
            setFeeds([...respData])
            setIsLoaded(true)
        }
        else {
            setFeeds([])
            setIsLoaded(true)
        }
    }
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
                <div className="container mx-auto ">
                    {feeds.map((feed, index) => (
                        <FeedCard key={index} feed={feed} />
                    ))}
                </div>
            )}
            {isLoaded && feeds.length === 0 && (
                <h2 className="text-center m-4">No Feed available.</h2>
            )}

        </div>
    )
}

export default Feed;
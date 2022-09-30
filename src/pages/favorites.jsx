import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FavBookCard from "../components/fav-book-card";
import Loader from "../components/loader";

const Favorites = () => {
    const authStates = useSelector(states => states.auth);
    const [favorites, setFavorites] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const fetchFavorites = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/fetch-favorites/`, {
            method: "GET",
            headers: {
                'Authorization': 'Token ' + authStates.token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            let respData = await response.json();
            setFavorites([...respData])
            setIsLoaded(true)
        }
        else {
            setFavorites([])
            setIsLoaded(false)
        }
    }
    useEffect(() => {
        fetchFavorites();
    }, [])
    const removeFromFavorites = async (bookId) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/remove-favorite/${bookId}/`, {
            method: "DELETE",
            headers: {
                'Authorization': 'Token ' + authStates.token,
                'Content-Type': 'application/json'
            }
        })
        if (response.ok) {
            fetchFavorites();
        }
    }
    return (
        <>
            <h1 className="text-center m-4">Favorites</h1>
            {!isLoaded && <div className="text-center">
                <Loader />
            </div>}
            {isLoaded && favorites.length === 0 && <h2 className="text-center m-4 text-muted">
                You do not have any favorites.
            </h2>}
            {isLoaded && favorites.length > 0 && (
                <div className="d-flex justify-content-center">
                    {favorites.map((book) => (
                        <FavBookCard key={book.id} book={book} remove={removeFromFavorites} />
                    ))}
                </div>

            )}
        </>
    )
}

export default Favorites;
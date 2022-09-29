import { Link } from "react-router-dom";
import StarIcon from '@mui/icons-material/Star';

const FeedCard = (props) => {
    const { feed } = props;
    console.log(feed)
    return (
        <div className="shadow-self p-4 rounded-3 my-4">
            <div>
                <img src={feed.creator.image} alt="PROFILE IMAGE" width={25} className="me-2 rounded-circle" /> <Link className="text-primary" to={'/user/' + feed.creator.id + '/'}>{feed.creator.name}</Link>&nbsp;
                {feed.review && (
                    <>
                        <span>gave his review on the <Link className="text-primary" to={'/books/' + feed.book.id + '/' + feed.book.name + '/'}>book.</Link></span>
                        <div className="row my-4">
                            <div className="col-md-3">
                                <img src={feed.book.image} alt="BOOK_IMAGE" width={100} />
                            </div>
                            <div className="col-md-9">
                                <div><b>Name: </b>{feed.book.name}</div>
                                <div><b>Price: </b>{feed.book.price}</div>
                                <div><b>Rating: </b>
                                    <span className="mb-3">
                                        {Array.from(Array(feed.review.rating), (e, i) => {
                                            return <span key={i} className="star-color"><StarIcon /></span>
                                        })}
                                    </span>
                                </div>
                                <div><b>comment: </b>{feed.review.comment}</div>

                            </div>
                        </div>

                    </>
                )}
                {feed.favorite && (
                    <>
                        <span>marked <Link className="text-primary" to={'/books/' + feed.book.id + '/' + feed.book.name + '/'}>{feed.book.name}</Link> as favorite.</span>
                        <div className="row my-4">
                            <div className="col-md-3">
                                <img src={feed.book.image} alt="BOOK_IMAGE" width={100} />
                            </div>
                            <div className="col-md-9">
                                <div><b>Name: </b>{feed.book.name}</div>
                                <div><b>Price: </b>{feed.book.price}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>


        </div>
    )
}

export default FeedCard;
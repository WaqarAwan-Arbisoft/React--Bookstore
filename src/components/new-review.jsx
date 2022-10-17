import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PrimaryBtn1 from '../UI/primary-btn';
const NewReview = (props) => {
    const authStates = useSelector(states => states.auth);
    const [rating, setRating] = useState(2)
    const [comment, setComment] = useState('');
    const [error, setError] = useState({ status: false, message: '' });
    const addCommentHandler = async () => {
        if (comment === '') {
            setError({ status: true, message: "Please write something first." })
            return;
        }
        setError({ ...error, status: false })
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/shop/add-review/`, {
            method: "POST",
            headers: {
                'Authorization': `Token ${authStates.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "comment": comment,
                "rating": rating,
                "book": props.bookId
            })
        })

        if (response.ok) {
            props.loadReviews();
            setComment('')
            setRating(2)
        }
        else {
            setError({ status: true, message: response.statusText })
        }
    }
    const commentChangeHandler = (e) => {
        setComment(e.target.value);
    }
    return (
        <div className="shadow p-4 rounded-4">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <img src={authStates.image ? authStates.image : require('../assets/images/DEFAULT_RPOFILE_PICTURE.png')} className="rounded-circle" alt="PROFILE_IMAGE" width={50} />
                <b className="my-2">{authStates.username}</b>
            </div>
            <hr />
            <div className="mt-3">
                <div>
                    <textarea className={"w-100 p-3 " + (error.status ? "border border-danger" : "border-0")} rows={5} placeholder="Write your comment here..." onChange={commentChangeHandler} value={comment}>
                    </textarea>
                    {error.status && <small className='ps-2 text-danger'>{error.message}</small>}
                </div>


                <div>
                    <Box
                        sx={{
                            '& > legend': { mt: 2 },
                        }}
                    >
                        <Typography component="legend">Rate the book.</Typography>
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                        />
                    </Box>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
                <PrimaryBtn1 onClick={addCommentHandler}>Add Comment</PrimaryBtn1>
            </div>
        </div>
    );
}

export default NewReview;
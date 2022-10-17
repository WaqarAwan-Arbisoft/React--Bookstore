import StarIcon from '@mui/icons-material/Star';
const Review = (props) => {
    return (
        <div className="shadow p-4 rounded-4">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <img src={props.review.user.image ? props.review.user.image : require('../assets/images/DEFAULT_RPOFILE_PICTURE.png')} className="rounded-circle" alt="PROFILE_IMAGE" width={50} />
                <b className="my-2">{props.review.user.name}</b>
            </div>
            <hr />
            <div className="mt-3">
                <div className="mb-3">
                    {Array.from(Array(props.review.rating), (e, i) => {
                        return <span key={i} className="star-color"><StarIcon /></span>
                    })}
                </div>
                {props.review.comment}
            </div>
            <div className="d-flex justify-content-end mt-3 text-muted">
                {props.review.creation}
            </div>
        </div>
    )
}

export default Review;
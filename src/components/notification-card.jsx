import { Link } from "react-router-dom";

const NotificationCard = (props) => {
    const { notification } = props;
    return (
        <div className="text-center shadow py-3 px-2 rounded my-3 d-flex justify-content-center align-items-center">
            <div className="me-2 rounded-circle">
                <img src={notification.receiver.image} alt="USER_PROFILE_IMAGE" width={25} />
            </div>
            <div className="me-2">
                <Link className="text-primary" to={'/user/' + notification.receiver.id}>{notification.receiver.name}</Link>
            </div>
            <div className="me-2">
                has accepted your friend request.
            </div>

        </div>
    )
}

export default NotificationCard;
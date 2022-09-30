import { Link } from "react-router-dom";

const NotificationCard = (props) => {
    const { notification } = props;
    return (
        <div className="text-center shadow py-3 px-2 rounded my-3">
            <Link className="text-primary" to={'/user/' + notification.receiver.id}>{notification.receiver.name}</Link> has accepted your friend request.
        </div>
    )
}

export default NotificationCard;
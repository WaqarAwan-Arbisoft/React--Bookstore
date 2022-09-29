import { Link } from "react-router-dom";
import PrimaryBtn1 from "../UI/primary-btn";

const RequestCard = (props) => {
    const { request } = props;
    return (
        <div className="row align-items-center shadow-self p-3 rounded-3">
            <div className="col-md-9">
                <Link className="text-primary" to={'/user/' + request.initiatedBy.id}>{request.initiatedBy.name}</Link> has sent a friend request to you.
            </div>
            <div className="col-md-3">
                <PrimaryBtn1 color="success" className='mx-2'>Accept</PrimaryBtn1>
                <PrimaryBtn1 color="error" className='mx-2'>Decline</PrimaryBtn1>
            </div>
        </div>
    )
}

export default RequestCard;
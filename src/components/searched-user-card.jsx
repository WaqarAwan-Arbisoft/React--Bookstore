import { Link } from "react-router-dom";
import PrimaryBtn1 from "../UI/primary-btn";

const SearchedUserCard = (props) => {
    const { user } = props;
    return (
        <div className="border-top border-bottom row p-3 align-items-center">
            <div className="col-md-1 rounded-circle">
                <img src={user.image} alt="USER_PROFILE_IMAGE" width={50} />
            </div>
            <div className="col-md-9">
                {user.name}
            </div>
            <div className="col-md-2">
                <PrimaryBtn1><Link to={'/user/' + user.id + '/'}>View Profile</Link></PrimaryBtn1>
            </div>
        </div>
    )
}

export default SearchedUserCard;
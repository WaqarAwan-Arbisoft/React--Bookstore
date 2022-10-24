import { Link } from "react-router-dom";

const ChatMessage = (props) => {
    return (
        <>
            {props.isUserMessage && (
                <div className="mb-2 msg_box_self rounded-3 p-2">
                    <span className="fw-bold">You: </span><span className="user_msg">{props.data.msg}</span>
                </div>
            )}
            {!props.isUserMessage && (
                <div className="mb-2 msg_box_other rounded-3 p-2">
                    <span className="fw-bold"><Link to={'/user/' + props.data.id}>{props.data.name}:</Link> </span><span className="user_msg">{props.data.msg}</span>
                </div>
            )}
        </>
    );
}

export default ChatMessage;
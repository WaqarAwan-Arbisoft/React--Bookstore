import PrimaryBtn1 from "../UI/primary-btn";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { useState } from "react";
import { useSelector } from "react-redux";
import ChatMessage from "../components/chat-msg";
import { useRef } from "react";
const Chatroom = () => {
    const client = new W3CWebSocket("ws://127.0.0.1:8000/ws/chatroom/");
    const authStates = useSelector(states => states.auth)
    const [msgList, setMsgList] = useState([]);
    const userMessageElem = useRef()
    const sendMessageHandler = () => {
        if (userMessageElem.current.value === '') {
            return;
        }
        client.send(JSON.stringify({
            type: "message",
            message: userMessageElem.current.value,
            sender: {
                name: authStates.username,
                id: authStates.id,
                email: authStates.email
            }
        }))
        userMessageElem.current.value = ''
    }
    client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        if (dataFromServer) {
            setMsgList(
                [
                    ...msgList,
                    {
                        msg: dataFromServer.message,
                        name: dataFromServer.sender.name,
                        email: dataFromServer.sender.email,
                        id: dataFromServer.sender.id
                    }
                ]
            );
        }
    }
    return (
        <div className="container mx-auto">
            <h1 className="text-center m-4">Chatroom</h1>
            <div className="shadow chatroom_msgs_container">
                {msgList.map((msgDetail, index) => (
                    msgDetail.email === authStates.email ? (
                        <ChatMessage key={index} isUserMessage={true} data={msgDetail} />
                    ) : <ChatMessage key={index} isUserMessage={false} data={msgDetail} />
                ))}
            </div>
            <div className="chatroom_write_msg_container my-4">
                <input type="text" className="shadow px-2 py-3" placeholder="Write your message here..." ref={userMessageElem} />
                <div className="text-end mt-3">
                    <PrimaryBtn1 onClick={sendMessageHandler} >Send Message</PrimaryBtn1>
                </div>
            </div>
        </div>
    )
}

export default Chatroom;
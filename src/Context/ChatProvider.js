import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import ChatContext from './ChatContext';

const ChatProvider = (props) => {

    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState()
    const [chats,setChats] = useState([]);
    const [notification,setNotification] = useState([]);
    const history = useHistory();

    useEffect(() =>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) history.push("/");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);

  return (
    <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
      {props.children}
    </ChatContext.Provider>
  )
}

export default ChatProvider

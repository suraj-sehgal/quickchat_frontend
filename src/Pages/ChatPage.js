import React, {useContext,useEffect, useState} from 'react'
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscelleneous/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import ChatContext from '../Context/ChatContext';

const ChatPage = () => {
const context = useContext(ChatContext);
const [fetchAgain,setFetchAgain]= useState(false);
const {user} = context;
    return (
        <div  style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain}  />} 
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage

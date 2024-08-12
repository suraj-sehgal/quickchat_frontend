import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../Context/ChatContext';
import axios from 'axios';
import { Box, Button, Stack, Text, Toast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from "./ChatLoading";
import { getSender } from "../config/ChatLogics"
import GroupChat from './miscelleneous/GroupChat';


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const context = useContext(ChatContext);
  const { user, selectedChat, setSelectedChat, chats, setChats } = context;


  const fetchChats = async () => {

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat`, config)
      console.log(data);
      setChats(data);


    } catch (error) {
      Toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });

    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain])


  return (
    <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }} flexDir="column" alignItems="center" p={3} bg='white' w={{ base: "100%", md: "31%" }} borderRadius="lg" borderWidth="1px">
      <Box pb={3} px={3} fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans" display='flex' w="100%" justifyContent="space-between" alignItems='center'>
        My Chats
        <GroupChat>
          <Button display="flex" fontSize={{ base: "17px", md: "10px", lg: "17px" }} leftIcon={<AddIcon />} >New Group Chat</Button>
        </GroupChat>
      </Box>
      <Box display="flex" flexDirection="column" p={3} bg="#F8F8F8" w="100%" h="100%" borderRadius="lg" overflow="hidden" >
        {chats ? (<Stack overflow="scroll" height='100%'>
          {chats?.map((chat, index) => (
            <Box key={index} onClick={() => setSelectedChat(chat)} cursor="pointer" bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"} color={selectedChat === chat ? "white" : "black"} px={3} py={2} borderRadius="lg">
              <Text>{!chat?.isGroupChat ? getSender(loggedUser, chat.users || []) : chat.chatName}</Text>
            </Box>
          ))}
        </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats

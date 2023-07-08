import React, { useContext } from 'react'
import ChatContext from '../Context/ChatContext'
import { Box } from '@chakra-ui/react';
import SingleChats from './SingleChats';

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const context = useContext(ChatContext);
  const {selectedChat} = context;
  return (
    <Box display={{base: selectedChat? "flex":"none", md:"flex"}} alignItems='center' flexDir='column' p={3} bg='white' w={{base:"100%", md:"68%"}} borderRadius="lg" borderWidth="1px" >
      <SingleChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
  )
}

export default ChatBox

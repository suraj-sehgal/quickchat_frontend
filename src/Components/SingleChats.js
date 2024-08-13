import React, { useContext, useEffect, useState } from 'react'
import ChatContext from '../Context/ChatContext'
import { Box,Button,FormControl,IconButton,Input,Spinner,Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscelleneous/ProfileModal';
import UpdateChatGroupModel from './miscelleneous/UpdateChatGroupModel';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import { IoIosSend } from "react-icons/io";

import io from "socket.io-client";
const ENDPOINT = `${process.env.REACT_APP_API_URL}`;
var socket;
var selectedChatCompare;

const SingleChats = ({fetchAgain,setFetchAgain}) => {

    const [messages,setMessages] =useState([]);
    const [loading,setLoading]= useState(false);
    const [newMessage,setNewMessage]= useState("");
    const [socketConnected,setSocketConnected] = useState();
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);
    const toast = useToast();

    const {user,selectedChat,setSelectedChat,notification,setNotification} = useContext(ChatContext);
    
    const fetchMessages = async ()=>{
        if(!selectedChat?._id)return;

        try {
            setLoading(true);
            const config = {
                headers : {
                    Authorization:`Bearer ${user.token}`,
                    "Content-Type":"application/json"
                }
            };
            
            const {data}=await axios.get(`${process.env.REACT_APP_API_URL}/api/message/${selectedChat?._id}`,config);
            // console.log(data);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat",selectedChat._id);

        } catch (error) {
            console.log(error);
            toast({
                title:"Error Occured!",
                description:"Failed to Load Messages",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            })
        }
    }

    useEffect(()=>{
        socket= io(ENDPOINT);
        socket.emit("setup",user);
        socket.on('connected',()=> setSocketConnected(true));
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
     },[])

    useEffect(()=>{
        fetchMessages();

        selectedChatCompare=selectedChat;

        // eslint-disable-next-line
    },[selectedChat]);


    useEffect(()=>{
        socket.on("message received",(newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
                // give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessages([...messages,newMessageRecieved]);
            }
        });
    });

    const sendMessage = async(event)=>{
        if((event.key==="Enter" || event.type === "click") && newMessage){
            socket.emit("stop typing",selectedChat._id);
            try {
                const config = {
                    headers : {
                        Authorization:`Bearer ${user.token}`,
                        "Content-Type":"application/json"
                    }
                };
                setNewMessage("");
                const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/message/`,{content: newMessage, chatId: selectedChat._id},config);
                setMessages([...messages,data]);
                socket.emit("new message",data);

            } catch (error) {
                toast({
                    title:"Error Occured!",
                    description:"Failed to send message",
                    status:"error",
                    duration:3000,
                    isClosable:true,
                    position:"top"
                })
            }
        }
     }

     

    const typingHandler = (e)=>{
        setNewMessage(e.target.value);

        //Typing Indicator Logic
        if(!socketConnected) return;
        
        if(!typing){
            setTyping(true);
            socket.emit('typing',selectedChat._id);
        }

        let lastTypingTime= new Date().getTime();
        var timerLength = 3000;
        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var  timeDiff = timeNow- lastTypingTime;
            if(timeDiff>=timerLength){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }

        },timerLength);
    }

  return (
    <>
      {selectedChat ?( 
        <>
            <Box fontSize={{base: "28px" ,md: "30px"}} pb={3} px={2} w='100%' fontFamily='Work sans' display='flex' justifyContent={{base:"space-between"}} alignItems='center'> 
                <IconButton display={{base:"flex" , md: "none"}} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")}/>
                {!selectedChat?.isGroupChat ? (
                    <Box display={'flex'} justifyContent={"space-between"}>
                        {getSender(user,selectedChat?.users || [])}
                        <ProfileModal user={getSenderFull(user,selectedChat?.users||[])}/>
                    </Box>
                ):(
                    <>
                        {selectedChat?.chatName?.toUpperCase()}
                        <UpdateChatGroupModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                    </>
                )}
            </Box>
            <Box display='flex' flexDir='column' justifyContent='flex-end' p={3} bg='#E8E8E8' w='100%' h='100%' borderRadius='lg' overflow='hidden' >
                  {/* //  Message here */}
                  {loading?(<Spinner size='xl' w={20} h={20} alignSelf='center' margin='auto' />):(
                  <div className='messages'>
                        <ScrollableChat messages={messages}/>
                  </div>
                  )}

                <FormControl pos={'relative'} onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping && <div>Typing...</div>}
                    <Input variant='filled' bg='#E0E0E0' onChange={typingHandler} color='black' value={newMessage} placeholder='Enter Message..'/>
                    <Button variant={'none'} pos={'absolute'} _hover={{transform: 'scale(1.2)',transition: 'transform 0.2s ease-in-out'}} right={5} bottom='2px' onClick={sendMessage}>
                        <IoIosSend  size={30} color='#606060'/>
                    </Button>
                </FormControl>
            </Box>
        </>
      ):(
            <Box  display='flex' alignItems='center' justifyContent='center' h='100%' >
                <Text fontSize='3xl' pb={3} fontFamily='Work sans'>Click on a user to start conversation</Text>
            </Box>
      )}</>
  )
}

export default SingleChats

import { Box,Text,MenuButton, Button,Tooltip, Menu, MenuList, Avatar, MenuItem, MenuDivider, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, DrawerCloseButton, useToast, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useContext } from 'react';
import {BellIcon, ChevronDownIcon} from '@chakra-ui/icons'
import ChatContext from '../../Context/ChatContext';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvtar/UserListItem';
import { getSender } from '../../config/ChatLogics';
// import NotificationBadge, { Effect } from 'react-notification-badge';

const SideDrawer = () => {
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const [loadingChat,setLoadingChat] = useState(false);
    const [loginUser,setLoginUser]=useState();

    const context = useContext(ChatContext);
    const {user,setSelectedChat,chats,notification,setNotification}=context;
    console.log(user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    

    const history = useHistory();
    const LogOutHandler = ()=>{
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch =async () =>{
        if(!search){
            toast({
                title:"Please enter something in search",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top-left",
            });
            return;
        }

        try {
            setLoading(true);
            const config ={
                headers: {
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/user?search=${search}`,config);

            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to Load the Search Results",
                status: "error",
                duration:3000,
                isClosable:true,
                position:"top-left",
            });
        }
    };

    const accessChat =async (userId) =>{
        try {
            setLoadingChat(true);

            const config = {
                headers : {
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}` 
                },

            };

            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`,{userId},config);
            if(!chats.find((c)=> c._id === data._id)){
                setSelectedChat([data, ...chats]);
            }
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title:"Error Occured!",
                description: error.message,
                status: "error",
                duration:3000,
                isClosable:true,
                position:"bottom-left",
            });
        }

    }

  return( 
    <Box>
      <Box display='flex'justifyContent='space-between' bg='white' w='100%' p="5px 10px 5px 10px" borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
            <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search fa-flip"></i>
                <Text display={{base:"none", md:"flex"}} px="4"> Search User</Text>
            </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans'>QuickChat</Text>
        <div>
            <Menu>
                <MenuButton  p={1}>
                    {/* <NotificationBadge count={notification.length} effect={Effect.SCALE} />  */}
                    <Box position={'relative'} padding={1} marginRight={4} borderRadius={'50%'} bgColor={'#C0C0C0'}>
                        <Box pos={'absolute'} top={0} fontSize={20} right={1}>{notification.length>0?notification.length:""}</Box>
                        <BellIcon fontSize="2xl" m={1} />
                    </Box>
                </MenuButton>
                <MenuList pl={2}>
                    {!notification.length &&  "No New Messages"}
                    {notification.map((notif,index)=>( 
                        <MenuItem key={index} onClick={()=>{
                            setSelectedChat(notif.chat);
                            setNotification(notification.filter((n)=> n!==notif));
                        }}>{notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}</MenuItem>
                    ))}
                </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic}/>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                        <MenuItem>My Profile</MenuItem>
                    </ProfileModal>
                    <MenuDivider/>
                    <MenuItem onClick={LogOutHandler}>Log Out</MenuItem>
                </MenuList>
            </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement='left' onClose={onClose} >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display='flex' pb={2}>
                <Input placeholder='Search By name or email' mr={2} value={search} onChange={(e)=>setSearch(e.target.value)} />
                <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading/>):(
                searchResult?.map((user,index) => (
                    <UserListItem key={index} user={user} handleFunction={()=> accessChat(user._id)} />
                ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
    );
};

export default SideDrawer

import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton,Spinner, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import ChatContext from '../../Context/ChatContext'
import UserBadgeItem from '../UserAvtar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvtar/UserListItem'

const UpdateChatGroupModel = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);
    const [renameLoading,setRenameLoading] = useState(false);
    const toast = useToast();

    const {selectedChat, setSelectedChat , user}= useContext(ChatContext);

    const handleRemove =async (removeUser) =>{
        if(selectedChat.groupAdmin._id!== user._id && removeUser._id!== user._id){
            toast({
                title:"Only admin can remove member!",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put(`${process.env.REACT_APP_API_URL}/api/chat/groupremove`,{chatId:selectedChat._id, userId: removeUser._id},config);
            removeUser._id===user._id?  setSelectedChat() : setSelectedChat (data) ;
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status: "error",
                duration:3000,
                isClosable:true,
                position:"buttom",
            });
            setLoading(false);
        }
    }

    // Rename Group Name
    const handleRename = async () =>{
        if(!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            
            const {data}= await axios.put(`${process.env.REACT_APP_API_URL}/api/chat/rename`,{chatId:selectedChat._id, chatName:groupChatName },config )
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            toast({
                title:"Updated",
                status: "success",
                duration:3000,
                isClosable:true,
                position:"top",
            });

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status: "error",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch =async (query) =>{
        setSearch(query);
        if(!query)
            return;
        try {
            setLoading(true);
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const {data}= await axios.get(`${process.env.REACT_APP_API_URL}/api/user?search=${search}`,config);
            console.log(data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to Load the Search Results",
                status: "error",
                duration:3000,
                isClosable:true,
                position:"buttom-left",
            });

        }
    }

    const handleAddUser =async (addUser)=>{
        if(selectedChat.users.find((u)=> u._id===addUser._id)){
            toast({
                title:"User Already in Group",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        if(selectedChat.groupAdmin._id!== user._id){
            toast({
                title:"Only admin can add member",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data} = await axios.put(`${process.env.REACT_APP_API_URL}/api/chat/groupadd`,{chatId: selectedChat._id, userId: addUser._id},config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:error.response.data.message,
                status: "error",
                duration:3000,
                isClosable:true,
                position:"buttom",
            });
            setLoading(false);
        }
    };

    return (
        <>
            <IconButton display={{base:"flex"}}  icon={<ViewIcon/>} onClick={onOpen}/>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize='35px' fontFamily='Work sans' display='flex' justifyContent='center'>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w='100%' display='flex' flexWrap='wrap' pb={3}>
                            {selectedChat.users.map((u) =>(
                                <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                            ))}
                        </Box>
                        <FormControl display='flex'>
                            <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)}/>
                            <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add User to Group' mb={1} onChange={(e)=>handleSearch(e.target.value)} />
                        </FormControl>
                        {loading? ( <Spinner size='lg'/>):(searchResult?.slice(0,4).map((u)=>(<UserListItem key={u._id} user={u} handleFunction={()=>handleAddUser(u)}/>)))}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={()=> handleRemove(user)}>Leave Group</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateChatGroupModel

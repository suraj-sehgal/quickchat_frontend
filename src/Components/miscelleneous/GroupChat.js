import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import ChatContext from '../../Context/ChatContext';
import axios from 'axios';
import UserListItem from '../UserAvtar/UserListItem';
import UserBadgeItem from '../UserAvtar/UserBadgeItem';

const GroupChat = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUser,setSelectedUser] = useState([]);
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading] = useState(false);

    const toast = useToast();
    const context = useContext(ChatContext);

    const {user,chats,setChats} = context;

    const handleSearch = async (query) =>{
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

    const handleSubmit =async  () =>{
        if(!groupChatName || !selectedUser){
            toast({
                title:"Please fill all the details",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        try {
            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const {data}=await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/group`,{name:groupChatName, users:JSON.stringify(selectedUser.map((u)=> u._id)),},config);
            setChats([data,...chats]);
            onClose();

            toast({
                title:"New Group Created",
                // description:"Failed to Create New Group",
                status: "success",
                duration:3000,
                isClosable:true,
                position:"top",
            });

        } catch (error) {
            toast({
                title:"Error Occured!",
                description:"Failed to Create New Group",
                status: "error",
                duration:3000,
                isClosable:true,
                position:"buttom-left",
            });
        }
    }
    const handleGroup = (userToAdd)=>{
        if(selectedUser.includes(userToAdd)){
            toast({
                title:"User Already Added",
                status: "warning",
                duration:3000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        setSelectedUser([...selectedUser,userToAdd]);
    }

    const handleDelete = (deleteUser) =>{
        setSelectedUser(selectedUser.filter((sel)=> sel._id!==deleteUser._id))
    }

  return (
<>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center" >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" >
                <FormControl>
                    <Input placeholder='Chat Name' mb={3} onChange={(e)=> setGroupChatName(e.target.value)} />
                </FormControl>
                <FormControl>
                    <Input placeholder='Add Users eg: Ankit , Anirudh' mb={1} onChange={(e)=> handleSearch(e.target.value)} />
                </FormControl>
                <Box display="flex" w="100%" flexWrap="wrap">
                {/* selected users */}
                {selectedUser.map((u,index)=>(
                    <UserBadgeItem key={index} user={u} handleFunction={()=>handleDelete(u)}  />
                ))}
                </Box>
                {/* render searched users */}
                {loading ? <div>loading</div> : (
                    searchResult?.slice(0,4).map((user,index) =>(
                        <UserListItem key={index} user={user} handleFunction={()=>handleGroup(user)} />
                    ))
                )}
                
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue'  onClick={handleSubmit}>Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChat

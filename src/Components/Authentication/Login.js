import { Button, FormControl,useToast, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ChatContext from '../../Context/ChatContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading,setLoading] = useState(false);

    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    let history=useHistory();
    const {setUser}=useContext(ChatContext);

    const baseUrl = process.env.REACT_APP_API_URL;
    console.log(baseUrl);

    const submitHandler =async () => {
        setLoading(true);
        if( !email || !password){
            toast({
                title: 'Please Fill all the fields.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            })
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const {data} = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`,{email,password},config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUser(JSON.stringify(data));
            setLoading(false);
            toast({
                title: 'Loggin Successfull.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            })
            history.push("/chats");

        } catch (error) {
            toast({
                title: 'Error Occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
        }

    };

    return (
        <VStack spacing="5px">
            <FormControl id='email' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id='password' isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? 'text' : 'password'} value={password} placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement>
                        <Button onClick={handleClick} h={"1.75rem"} size={"sm"} margin="0 10px 0 0" px={"5"}>{show ? "Hide" : "Show"}</Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button  width={"100%"} colorScheme="blue" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={loading}>Login</Button>
            <Button variant={"solid"} colorScheme="red"  width={"100%"} onClick={() => {
                setEmail("guest@gmail.com");
                setPassword("123456");
            }}> Get Guest User Credentials</Button>
        </VStack>
    )
}

export default Login

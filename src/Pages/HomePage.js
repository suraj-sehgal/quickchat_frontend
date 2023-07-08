import React, { useEffect } from 'react'
import { Container, Box, Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../Components/Authentication/Login'
import SignUp from '../Components/Authentication/SignUp'
import { useHistory } from 'react-router-dom'
import "../App.css"

const HomePage = () => {

    const history=useHistory();

    useEffect(() => {
        const userInfo= JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo)
            history.push("/chats");
    },[history]);

    return (
        <Container maxW='xl' centerContent>
            <Box id='grad' d='flex' fontWeight='bold' justifyContent={"center"} p={3}  w={"100%"} m="40px 0 15px 0" borderRadius={"lg"} borderWidth="1px" >
                <Text fontSize={"4xl"} fontFamily={"Work sans"} textAlign={"center"} color="white" >QuickChat</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"}>
                <Tabs variant='soft-rounded'>
                    <TabList>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel><Login /></TabPanel>
                        <TabPanel><SignUp /></TabPanel>
                    </TabPanels>
                </Tabs>

            </Box>
        </Container>
    )
}

export default HomePage

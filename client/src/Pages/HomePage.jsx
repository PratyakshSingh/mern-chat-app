import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (!user) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent={true}>
      <Box
        display="flex"
        justifyContent="center"
        minWidth="100%"
        backgroundColor="white"
        borderRadius="10px"
        m="40px 0 20px 0"
        p="20px"
        borderWidth="2px"
      >
        <Text fontSize="25px" fontFamily="sans-serif">
          Chat App
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="10px" borderWidth="5px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;

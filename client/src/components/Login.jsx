import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleLoginSubmit = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Provide email and password",
        duration: 5000,
        isClosable: true,
        colorScheme: "red",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `/api/user/login`,
        { email, password },
        config
      );
      if (!data) {
        toast({
          title: "Error Logging In",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Logging In",
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleGuestClick = () => {
    setEmail("piyush@example.com");
    setPassword(123456);
  };

  return (
    <VStack spacing="14px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button width="100%" colorScheme="blue" onClick={handleLoginSubmit}>
        Login
      </Button>
      <Button width="100%" colorScheme="red" onClick={handleGuestClick}>
        Get Guest Credentials
      </Button>
    </VStack>
  );
};

export default Login;

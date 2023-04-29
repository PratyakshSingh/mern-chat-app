import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChevronDownIcon, EmailIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import ProfileModal from "./ProfileModal";

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats, setSelectedChat, notification } = ChatState();

  const toast = useToast();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    setLoading(true);
    setSearch(query);
    if (!query || query === "") {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchedUsers(data);
      setLoading(false);
    } catch (error) {
      toast({
        title: "No Users found",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    setChatLoading(true);
    if (!userId) {
      toast({
        title: "Cannot create chat",
        duration: 5000,
        isClosable: true,
      });
      setChatLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/newChat",
        { userId },
        config
      );

      setChatLoading(false);

      const chatAlreadyPresent = chats.find((chat) => chat._id === data._id);

      if (!chatAlreadyPresent) {
        setChats([data, ...chats]);
        setSelectedChat(data);
      } else {
        setSelectedChat(chatAlreadyPresent);
      }
      setFetchAgain(!fetchAgain);
      setSearch("");
      setSearchedUsers([]);
      onClose();
    } catch (error) {
      toast({
        title: "Error in creating chat",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const loginHandler = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat();
    navigate("/");
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="10px"
        margin="0"
        bg="white"
        borderWidth="4px"
        borderRadius="4px"
      >
        <Button onClick={onOpen}>
          <Text px={6}>Search Users</Text>
        </Button>
        <Text fontSize="2xl">Chat App</Text>
        <div>
          <Menu>
            <MenuButton as={Button} rightIcon={<EmailIcon />} mx={4} pr={5}>
              {notification.length > 0 ? notification.length : ""}
            </MenuButton>
            {/* <MenuList>Notifications</MenuList> */}
            <MenuList>
              {notification.length > 0 ? (
                notification.map((noti, i) => (
                  <MenuItem
                    onClick={() => setSelectedChat(noti.chat)}
                    key={i}
                  >{`New Message from ${noti.sender.name}`}</MenuItem>
                ))
              ) : (
                <MenuItem>No New Messages</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} px={6}>
              {user.name}
            </MenuButton>
            <MenuList>
              <ProfileModal>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={loginHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search by email or name"
                width="80%"
                mr={2}
              />
              <Button colorScheme="blue" onClick={() => handleSearch(search)}>
                Go
              </Button>
            </Box>
            {loading ? (
              <Box textAlign="center">Loading...</Box>
            ) : (
              searchedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

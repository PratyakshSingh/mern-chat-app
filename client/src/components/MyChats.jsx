import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { AddIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import CreateGroupModal from "./CreateGroupModal";
import { getSender } from "../miscellaneous/ChatLogics";

// eslint-disable-next-line react/prop-types
const MyChats = ({ fetchAgain }) => {
  const {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    setNotification,
  } = ChatState();

  const toast = useToast();

  const openingChatToDisplayMessages = (chat) => {
    setSelectedChat(chat);
    setNotification([]);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/chat/`, config);
      console.log("Chats data: " + data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Cannot fetch the chats",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Box
      width="30%"
      bg="white"
      height="90vh"
      marginTop="10px"
      borderRadius="5px"
      borderWidth="5px"
      p={4}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Text fontSize="25px">Chats</Text>
        <CreateGroupModal>
          <Button leftIcon={<AddIcon />}>Create Group Chat</Button>
        </CreateGroupModal>
      </Box>
      <Stack overflowX="scroll" maxHeight="95%">
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <Box
              onClick={() => openingChatToDisplayMessages(chat)}
              bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              borderWidth="4px"
              borderRadius="5px"
              width="100%"
              key={chat._id}
              p={4}
              cursor="pointer"
              mb="1px"
            >
              {chat && chat?.isGroupChat
                ? chat.chatName
                : getSender(user, chat)}
            </Box>
          ))
        ) : (
          <Text fontSize="20px" fontWeight="500">
            No chats to display
          </Text>
        )}
      </Stack>
    </Box>
  );
};

export default MyChats;

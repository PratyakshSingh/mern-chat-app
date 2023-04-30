import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../miscellaneous/ChatLogics";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import "./styles.css";
import io from "socket.io-client";
import animationData from "../animations/typing.json";
import Lottie from "react-lottie";
import ChatProfileModal from "./ChatProfileModal";
import GroupChatProfileModal from "./GroupChatProfileModal";

const ENDPOINT = "https://mern-chat-app-g9l8.onrender.com";
let socket, selectedChatCompare;

// eslint-disable-next-line react/prop-types
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchAllMessages = async () => {
    setLoading(true);
    if (!selectedChat) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/message/${selectedChat._id}`,
      config
    );

    setMessages(data);
    setLoading(false);

    socket.emit("join chat", selectedChat._id);
  };

  //sending a message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error sending message",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    //function to stop showing typing after 3 seconds
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"], // Required when using Vite
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  //useeffect for fetching messages
  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // for notifications and setting messsages
  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <Box
      width="70%"
      height="90vh"
      bg="white"
      borderRadius="5px"
      borderWidth="5px"
      marginTop="10px"
      marginLeft="10px"
      backgroundColor="#E8E8E8"
    >
      {selectedChat === undefined ? (
        <Box
          fontSize="50px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          Click on a user to start Chatting
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            mt="10px"
            mb="10px"
          >
            <Text ml="20px" fontSize="30px">
              {selectedChat?.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat)}
            </Text>
            {/* Profile Modal for individual chats and group info for group chats*/}
            {selectedChat?.isGroupChat ? (
              <GroupChatProfileModal>
                <Button mr="10px">
                  <ViewIcon />
                </Button>
              </GroupChatProfileModal>
            ) : (
              <ChatProfileModal>
                <Button mr="10px">
                  <ViewIcon />
                </Button>
              </ChatProfileModal>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            width="98%"
            height="90%"
            m={2}
            p={4}
            borderRadius={2}
          >
            {/* Messages */}
            {loading ? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {isTyping ? (
              <>
                <Lottie
                  options={defaultOptions}
                  width={100}
                  height={10}
                  style={{
                    marginBottom: 15,
                    marginLeft: 0,
                  }}
                />
              </>
            ) : (
              <></>
            )}
            <FormControl
              onKeyDown={sendMessage}
              bg="white"
              borderWidth={1}
              borderRadius={2}
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                value={newMessage}
                onChange={typingHandler}
                placeholder="Enter a message.."
              />
            </FormControl>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatBox;

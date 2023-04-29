import { Box, Container } from "@chakra-ui/react";
import React, { useState } from "react";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../Context/ChatProvider";

const ChatsPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);

  const { user } = ChatState();
  return (
    <Container maxW="100%">
      {user && (
        <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Container>
  );
};

export default ChatsPage;

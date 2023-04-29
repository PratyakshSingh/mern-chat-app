/* eslint-disable react/prop-types */
import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      justifyContent="flex-start"
      p={2}
      mt={1}
      bg="#E8E8E8"
      borderRadius="10px"
      cursor="pointer"
      onClick={handleFunction}
    >
      <Text fontSize="20px">{user.name}</Text>
      <Text fontSize="15px">{user.email}</Text>
    </Box>
  );
};

export default UserBadgeItem;

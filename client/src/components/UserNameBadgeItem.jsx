import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

// eslint-disable-next-line react/prop-types
const UserNameBadgeItem = ({ user, handleDelete }) => {
  return (
    <Box
      onClick={handleDelete}
      backgroundColor="green"
      borderRadius="5px"
      p="5px"
      m={1}
      fontSize="15px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      cursor="pointer"
      color="white"
    >
      <Text mr="10px">{user.name}</Text>
      <DeleteIcon />
    </Box>
  );
};

export default UserNameBadgeItem;

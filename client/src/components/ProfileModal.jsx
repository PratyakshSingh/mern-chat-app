import {
  Box,
  Button,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";

// eslint-disable-next-line react/prop-types
const ProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = ChatState();
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
              mb={2}
            />
            <Box fontSize="30px" mb={2}>
              {user.name}
            </Box>
            <Box fontSize="20px" mb={2}>
              {user.email}
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;

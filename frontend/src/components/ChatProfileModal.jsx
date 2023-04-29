import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";

// eslint-disable-next-line react/prop-types
const ChatProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, selectedChat } = ChatState();

  const chatUserProfile =
    selectedChat.users[0]._id === user._id
      ? selectedChat.users[1]
      : selectedChat.users[0];

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
              src={chatUserProfile.pic}
              alt={chatUserProfile.name}
              mb={2}
            />
            <Box fontSize="30px" mb={2}>
              {chatUserProfile.name}
            </Box>
            <Box fontSize="20px" mb={2}>
              {chatUserProfile.email}
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatProfileModal;

import {
  Box,
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
import UserNameBadgeItem from "./UserNameBadgeItem";

// eslint-disable-next-line react/prop-types
const GroupChatProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat } = ChatState();

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {selectedChat?.users ? (
              <Box display="flex" flexWrap="wrap">
                {selectedChat?.users?.map((user) => (
                  <UserNameBadgeItem
                    key={user._id}
                    user={user}
                    // handleDelete={() => handleDelete(user)}
                  />
                ))}
              </Box>
            ) : (
              {}
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatProfileModal;

import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";
import UserNameBadgeItem from "./UserNameBadgeItem";

// eslint-disable-next-line react/prop-types
const CreateGroupModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats } = ChatState();

  const toast = useToast();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  //creating group
  const handleSubmit = async () => {
    setLoading(true);
    if (!groupName || !selectedUsers) {
      toast({
        title: "Please provide all group details",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/newGroupChat",
        { name: groupName, users: selectedUsers.map((u) => u._id) },
        config
      );

      // console.log(data);
      setSelectedUsers([]);
      setGroupName("");
      setSearch("");
      setChats([data, ...chats]);
      setLoading(false);

      toast({
        title: `${data.chatName} created`,
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error creating a chat",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      onClose();
    }
  };

  //list of users searched for a group
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

  //handling addition to group

  const handleAddToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  //   delete function to delete adding a user to group

  const handleDelete = (userToDelete) => {
    const newUsersList = selectedUsers.filter(
      (u) => u._id !== userToDelete._id
    );
    if (!newUsersList) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(newUsersList);
    }
  };

  useEffect(() => {
    handleSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column">
            <FormControl mb={2}>
              <Input
                placeholder="Group Chat Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search Users to add"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
            </FormControl>
            {/* searched users list */}
            {selectedUsers ? (
              <Box display="flex" flexWrap="wrap">
                {selectedUsers?.map((user) => (
                  <UserNameBadgeItem
                    key={user._id}
                    user={user}
                    handleDelete={() => handleDelete(user)}
                  />
                ))}
              </Box>
            ) : (
              {}
            )}
            {loading ? (
              <Box textAlign="center">Loading...</Box>
            ) : (
              searchedUsers
                ?.slice(0, 4)
                .map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddToGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;

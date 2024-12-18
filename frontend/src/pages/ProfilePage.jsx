import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Center,
  Avatar,
  AvatarBadge,
  Button,
  IconButton,
  Grid,
  Flex,
} from "@chakra-ui/react";

import { SmallCloseIcon } from "@chakra-ui/icons";
import { FiEdit } from "react-icons/fi";

import {useRecoilState} from 'recoil';
import userAtom from '../atoms/userAtom'

import usePriviewImg from '../hooks/usePriviewImg';
import useShowToast from "../hooks/useShowToast";

const ProfilePage = () => {
  const [user,setUser] = useRecoilState(userAtom);
  const [fullName, setFullName] = useState(user.fullName);
  const [businessName, setBusinessName] = useState(user.businessName);
  const [brandName, setBrandName] = useState(user.brandName);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [phone, setPhone] = useState(user.phone);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const {handleImageChange, imgUrl, setImgUrl} = usePriviewImg();
  const showToast = useShowToast();
  const disable = !user.isBusinessAccount;

  // Handle update
  const handleUpdate = async() => {
    try {
      setLoading(true);
      const res = await fetch('/api/users/update-profile', {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({fullName, businessName, brandName, email, address, phone, profilePic: imgUrl})
      });
      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      showToast('Success', "Profile updated", "success");
      localStorage.setItem('user-details', JSON.stringify(data));
      setUser(data);
      setLoading(false);
    } catch (error) {
      showToast('Error', error.message, "error");
      console.log(error.message);
    }
  }

  return (
    <Box width={"100%"} px={10}>
      <Box>
        <FormControl id="userName" w={"300px"}>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={imgUrl || user.profilePic} objectFit={'cover'}> 
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                  onClick={()=> setImgUrl("")}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full" onClick={() => fileRef.current.click()}>Change Icon</Button>
              <Input type="file" hidden ref={fileRef} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>

        <Box display={"grid"} gridTemplateColumns={"repeat(3,1fr)"} gap={10} mt={10}>
          <Box>
            <FormControl id="fullName">
              <FormLabel>Full Name</FormLabel>
              <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)}/>
            </FormControl>
          </Box>
          <Box>
            <FormControl id="businessName">
              <FormLabel>Business Name</FormLabel>
              <Input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} isDisabled={disable} />
            </FormControl>
          </Box>
          <Box>
            <FormControl id="brandName">
              <FormLabel>Brand Name</FormLabel>
              <Input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} isDisabled={disable}/>
            </FormControl>
          </Box>
          <Box>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
            </FormControl>
          </Box>
          <Box>
            <FormControl id="phoneNumber">
              <FormLabel>Phone Number</FormLabel>
              <Input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Ex. +91 9328077809"/>
            </FormControl>
          </Box>
          <Box>
            <FormControl id="phoneNumber">
              <FormLabel>Address</FormLabel>
              <Input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="address..."/>
            </FormControl>
          </Box>
        </Box>
        
        <Button colorScheme="blue" fontWeight={'500'} display={'flex'} alignItems={'center'} gap={2} mt={10} isLoading={loading} loadingText="Updating" onClick={handleUpdate}>
          <FiEdit size={'18px'}/>
          Update Profile
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePage;

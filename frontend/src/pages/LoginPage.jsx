import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

import useShowToast from "../hooks/useShowToast";

import { baseURL as BASEURL } from "../config/baseURL";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const showToast = useShowToast();
  const navigate = useNavigate();
  const [,setUser] = useRecoilState(userAtom);

  // Handle login
  const handleSubmit = async() => {
    if (!email || !password) {
      showToast('Error', "email and password field is required", "error");
      return;
    }

    try {
      const res = await fetch(`${BASEURL}/api/users/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
      });

      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      showToast('Success', "Login successfully.", "success");
      localStorage.setItem('user-details', JSON.stringify(data));
      setUser(data);
      navigate('/');

    } catch (error) {
      showToast('Error', error.message, "error");
      console.log(error);      
    }
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
    >
      <Stack spacing={8} mx={"auto"} maxW={'600px'} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} mb={2} textAlign={"center"}>
            Sign in your account.
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Stay logged in for an effortless shopping experience
          </Text>
        </Stack>

        <Box p={8}>
          <Stack spacing={4} width={"400px"} mx={"auto"}>

            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@gmail.com"/>
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}/>
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Signing"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Sign in
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Don't have an account?{" "}
                <Link as={RouterLink} to={"/signup"} color={"blue.400"}>
                  Signup
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;

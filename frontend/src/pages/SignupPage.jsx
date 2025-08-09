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
  Checkbox,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import useShowToast from "../hooks/useShowToast";

import { baseURL as BASEURL } from "../config/baseURL";


const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [isBusinessAccount, setIsBusinessAccount] = useState(false);
  const showToast = useShowToast();
  const navigate = useNavigate();

  // Signup User
  const handleSubmit = async() => {
    if (!email || !password) {
      showToast('Error', "email and password field is required", "error");
      return;
    }
    if (cPassword !== password) {
      showToast('Error', "Password doesn't match", "error");
      return;
    };
    
    try {
      const res = await fetch(`${BASEURL}/api/users/signup`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        credentials: 'include',
        body: JSON.stringify({fullName, businessName, brandName, email, password, isBusinessAccount})
      });

      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      
      showToast('Success', data.message, "success");
      navigate('/login');

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
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Join thousands of other fashion lovers ✌️
          </Text>
        </Stack>

        <Box p={8}>
          <Stack spacing={4} width={"400px"}>
            {!isBusinessAccount  && <FormControl id="name">
              <FormLabel>Full Name</FormLabel>
              <Input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your fullname"/>
            </FormControl>}

            {isBusinessAccount  && <FormControl id="businessname">
              <FormLabel>Business Name</FormLabel>
              <Input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Enter your business name"/>
            </FormControl>}

            {isBusinessAccount  && <FormControl id="brandname">
              <FormLabel>Brand Name</FormLabel>
              <Input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Enter your brand name"/>
            </FormControl>}

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

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input type={showConfirmPassword ? "text" : "password"} value={cPassword} onChange={e => setCPassword(e.target.value)}/>
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)
                    }
                    >
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl>
              <Checkbox isChecked={isBusinessAccount} onChange={e => setIsBusinessAccount(e.target.checked)}>Create a Business Account</Checkbox>
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
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={"center"}>
                Already have an account?{" "}
                <Link as={RouterLink} to={"/login"} color={"blue.400"}>
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupPage;

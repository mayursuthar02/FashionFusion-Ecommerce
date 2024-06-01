import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import {Button, Flex, Input, Text} from '@chakra-ui/react';
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaPinterest } from "react-icons/fa6";

const HomePage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <div>
      
      {/* JOIN US LINE */}
      <Flex color={'white'} bg={'black'} alignItems={'center'} justifyContent={'space-between'} px={'50px'} py={3}>
        <Text>BE IN TOUCH WITH US:</Text>

        <Flex gap={5}>
          <Input variant='unstyled' px={4} type="email" bg={'#222'} placeholder="Enter your email" border={"none"} outline={'none'} borderRadius={2} width={'400px'} color={'white'}/>
          <Button borderRadius={2} bgColor={'black'} border={'1px solid #fff'} color={'white'} _hover={{bgColor: 'white', color: 'black'}} px={5}>JOIN US</Button>
        </Flex>

        <Flex gap={4} fontSize={'lg'}>
          <FaFacebook cursor={'pointer'}/>
          <FaTwitter cursor={'pointer'}/>
          <RiInstagramFill cursor={'pointer'}/>
          <FaPinterest cursor={'pointer'}/>
        </Flex>
      </Flex>     
    </div>
  )
}

export default HomePage
import {Badge, Box, Button, Divider, Flex, IconButton, Menu, MenuButton, Link, MenuList} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiOutlineSearch } from "react-icons/hi";
import { PiHeartStraight } from "react-icons/pi";
import { LuUser2 } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";

import Logo from './Logo';

const Header = () => {
  return (
    <Flex py={'20px'} px={'50px'} alignItems={'center'} justifyContent={'space-between'}>
      <Link as={RouterLink} to={'/'}>
        <Logo/>
      </Link>

      <Flex alignItems={'center'} gap={5}>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Home</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Men</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Women</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Beauty</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Accessories</Link>
      </Flex>

      <Flex fontSize={'large'} alignItems={'center'} gap={2}>
        <Link as={RouterLink}>
          <IconButton aria-label='Search' icon={<HiOutlineSearch size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "#f1f1f1"}} borderRadius={'full'}/>
        </Link>
        
        <Link as={RouterLink} to={'/wishlist'}>
          <IconButton aria-label='Fvourite' icon={<PiHeartStraight size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "#f1f1f1"}} borderRadius={'full'}/>
        </Link>

        <Link as={RouterLink}>
          <Box position={'relative'}>
            <Badge variant='solid' bgColor={'#121212'} position={'absolute'} bottom={1} right={1} fontSize={'10px'} zIndex={1}>12</Badge>
            <IconButton aria-label='Cart' icon={<HiOutlineShoppingBag size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "#f1f1f1"}} borderRadius={'full'}/>
          </Box>
        </Link>

        <Menu>
          <MenuButton  bgColor={'white'} _hover={{bgColor: "#f1f1f1"}} borderRadius={'full'}>
            <IconButton aria-label='Cart' icon={<LuUser2 size={'1.5rem'}/>} bgColor={'transparent'}/>
          </MenuButton>
          <MenuList>
            <Flex flexDirection={'column'} px={5} py={3} gap={3}>
              <Link as={RouterLink}  _hover={{ color: 'blue.500' }}>Dashboard</Link>
              <Link as={RouterLink}  _hover={{ color: 'blue.500' }}>My Profile</Link>
              <Link as={RouterLink}  _hover={{ color: 'blue.500' }}>My Order</Link>
              <Divider/>
              <Link as={RouterLink} to={'/login'}>
                <Button w={'full'} colorScheme='blue'>Login</Button>
              </Link>
            </Flex>
          </MenuList>
        </Menu>
      </Flex>

    </Flex>
  )
}

export default Header
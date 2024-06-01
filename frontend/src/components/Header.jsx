import {Badge, Box, Button, Divider, Flex, IconButton, Menu, MenuButton, Link, MenuList, useDisclosure} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { HiOutlineSearch } from "react-icons/hi";
import { PiHeartStraight } from "react-icons/pi";
import { LuUser2 } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import Logo from './Logo';
import SearchModel from './SearchModel';

const Header = () => {
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  return (
    <Flex py={'20px'} px={'50px'} alignItems={'center'} justifyContent={'space-between'}>
      <Link as={RouterLink} to={'/'}>
        <Logo/>
      </Link>

      <Flex alignItems={'center'} gap={5}>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Home</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Men</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Women</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Kids</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Beauty</Link>
        <Link as={RouterLink} to={'/'} _hover={{ color: 'blue.500' }}>Accessories</Link>
      </Flex>

      <Flex fontSize={'large'} alignItems={'center'} gap={2}>
        <Link as={RouterLink} onClick={onOpen}>
          <IconButton aria-label='Search' icon={<HiOutlineSearch size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
        </Link>
        
        <Link as={RouterLink} to={'/wishlist'}>
          <IconButton aria-label='Fvourite' icon={<PiHeartStraight size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
        </Link>

        {user && <Link as={RouterLink}>
          <Box position={'relative'}>
            <Badge variant='solid' bgColor={'blue.500'} position={'absolute'} bottom={1} right={1} fontSize={'10px'} zIndex={1}>0</Badge>
            <IconButton aria-label='Cart' icon={<HiOutlineShoppingBag size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
          </Box>
        </Link>}

        <Menu>
          <MenuButton  bgColor={'white'} _hover={{bgColor: 'blue.50'}} borderRadius={'full'}>
            {<IconButton aria-label='User' icon={<LuUser2 size={'1.5rem'}/>} bgColor={'transparent'}/>}
          </MenuButton>
          <MenuList>
            <Flex flexDirection={'column'} px={5} py={3} gap={3}>
              {user && user.isBusinessAccount && <Link as={RouterLink} to={'/dashboard'}  _hover={{ color: 'blue.500' }}>Dashboard</Link>}
              {user && <Link as={RouterLink}  _hover={{ color: 'blue.500' }}>My Profile</Link>}
              {user && <Link as={RouterLink}  _hover={{ color: 'blue.500' }}>My Order</Link>}
              {!user && <Link as={RouterLink} to={'/login'}>
                <Button w={'full'} colorScheme='blue'>Login</Button>
              </Link>}
              {user && <Divider mb={2}/>}
              {user && <Button w={'full'} colorScheme='gray'>Logout</Button>}
            </Flex>
          </MenuList>
        </Menu>
      </Flex>

      <SearchModel isOpen={isOpen} onClose={onClose}/>

    </Flex>
  )
}

export default Header
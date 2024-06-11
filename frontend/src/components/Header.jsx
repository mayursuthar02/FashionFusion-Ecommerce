import {Badge, Box, Button, Divider, Flex, IconButton, Menu, MenuButton, Link, MenuList, useDisclosure, MenuItem, Avatar, Text} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { HiOutlineSearch } from "react-icons/hi";
import { PiHeartStraight } from "react-icons/pi";
import { LuUser2 } from "react-icons/lu";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import userAtom from '../atoms/userAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import Logo from './Logo';
import SearchModel from './SearchModel';
import useShowToast from '../hooks/useShowToast';
import { useEffect, useRef, useState } from 'react';
import { beautySubCategories, kidsSubCategories, menSubCategories, wommenSubCategories } from "../helpers/categories";
import CartDrawer from './CartDrawer';
import cartAtom from '../atoms/cartAtom';

const Header = () => {
  const [user,setUser] = useRecoilState(userAtom);
  const cartItems = useRecoilValue(cartAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenCart, onOpen: onOpenCart, onClose: onCloseCart } = useDisclosure();
  const [isOpens, setIsOpens] = useState({});
  const showToast = useShowToast();
  const navigate = useNavigate();
  const headerRef = useRef(null);

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current?.classList.add("sticky__header");
      } else {
        headerRef.current?.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    stickyHeaderFunc();
    return window.removeEventListener("scroll", stickyHeaderFunc);
  });
  
  
  const handleLogout = async() => {
    try {
      const res = await fetch('/api/users/logout', {
        method: "POST",
        headers: {"Content-Type":"application/json"},
      });

      const data = await res.json();
      if (data.error) {
        showToast('Error', data.error, "error");
        return;
      }
      showToast('Success', "Logged out", "success");
      localStorage.removeItem('user-details');
      setUser(null);
      navigate('/login');
    } catch (error) {
      
    }
  }

  const handleMouseEnter = (menu) => {
    setIsOpens((prev) => ({ ...prev, [menu]: true }));
  };

  const handleMouseLeave = (menu) => {
    setIsOpens((prev) => ({ ...prev, [menu]: false }));
  };

  const menuItems = [
    { label: 'Men', path: '/men' },
    { label: 'Women', path: '/women' },
    { label: 'Kids', path: '/kids' },
    { label: 'Beauty', path: '/beauty' },
    { label: 'Accessories', path: '/accessories' }
  ];
  
  return (
    <Flex py={'15px'} px={'50px'} bg={'white'} alignItems={'center'} justifyContent={'space-between'} zIndex={999} borderBottom={'1px solid'} borderColor={'gray.200'}  ref={headerRef}>
      <Link as={RouterLink} to={'/'}>
        <Logo/>
      </Link>

      <Flex alignItems={'center'} gap={5}>
        <Link as={RouterLink} to={`/`} _hover={{ color: 'blue.500' }}>Home</Link>
        {menuItems.map((item) => (
          <Menu isOpen={isOpens[item.label.toLowerCase()]} key={item.label}>
          <MenuButton
            as={RouterLink}
            to={item.path}
            _hover={{ color: 'blue.500' }}
            onMouseEnter={() => handleMouseEnter(item.label.toLowerCase())}
            onMouseLeave={() => handleMouseLeave(item.label.toLowerCase())}
            onClick={() => handleMouseLeave(item.label.toLowerCase())}
          >
            <RouterLink to={item.path}>{item.label}</RouterLink>
          </MenuButton>
              <MenuList onMouseEnter={() => handleMouseEnter(item.label.toLowerCase())} onMouseLeave={() => handleMouseLeave(item.label.toLowerCase())}>
                {item.label == 'Men' &&
                  menSubCategories.map((category) => (
                    <MenuItem key={category.value}>
                      <Link as={RouterLink} to={`/${item.label.toLowerCase()}/${category.value}`} _hover={{ color: 'blue.500'}} w={'200px'} onClick={() => handleMouseLeave(item.label.toLowerCase())}>{category.title}</Link>
                    </MenuItem>
                  ))
                }
                {item.label == 'Women' &&
                  wommenSubCategories.map((category) => (
                    <MenuItem key={category.value}>
                      <Link as={RouterLink} to={`/${item.label.toLowerCase()}/${category.value}`} _hover={{ color: 'blue.500' }} w={'200px'} onClick={() => handleMouseLeave(item.label.toLowerCase())}>{category.title}</Link>
                    </MenuItem>
                  ))
                }
                {item.label == 'Kids' &&
                  kidsSubCategories.map((category) => (
                    <MenuItem key={category.value}>
                      <Link as={RouterLink} to={`/${item.label.toLowerCase()}/${category.value}`} _hover={{ color: 'blue.500' }} w={'200px'} onClick={() => handleMouseLeave(item.label.toLowerCase())}>{category.title}</Link>
                    </MenuItem>
                  ))
                }
                {item.label == 'Beauty' &&
                  beautySubCategories.map((category) => (
                    <MenuItem key={category.value}>
                      <Link as={RouterLink} to={`/${item.label.toLowerCase()}/${category.value}`} _hover={{ color: 'blue.500' }} w={'200px'} onClick={() => handleMouseLeave(item.label.toLowerCase())}>{category.title}</Link>
                    </MenuItem>
                  ))
                }
              </MenuList>
          </Menu>
        ))}
      </Flex>

      <Flex fontSize={'large'} alignItems={'center'} gap={2}>
        <Link as={RouterLink} onClick={onOpen}>
          <IconButton aria-label='Search' icon={<HiOutlineSearch size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
        </Link>
        
        <Link as={RouterLink} to={'/wishlist'}>
          <IconButton aria-label='Fvourite' icon={<PiHeartStraight size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
        </Link>

        {user && 
        <Link as={RouterLink} onClick={onOpenCart}>
          <Box position={'relative'}>
            <Badge variant='solid' bgColor={'blue.500'} position={'absolute'} bottom={1} right={1} fontSize={'10px'} zIndex={1}>{cartItems.length}</Badge>
            <IconButton aria-label='Cart' icon={<HiOutlineShoppingBag size={'1.5rem'}/>} bgColor={"white"} _hover={{bgColor: "blue.50"}} borderRadius={'full'}/>
          </Box>
        </Link>}

        <Menu>
          <MenuButton  bgColor={'white'} _hover={{bgColor: 'blue.50'}} borderRadius={'full'}>
            {<IconButton aria-label='User' icon={<LuUser2 size={'1.5rem'}/>} bgColor={'transparent'}/>}
          </MenuButton>
          <MenuList zIndex={10}>
            <Flex flexDirection={'column'} px={5} py={3} gap={3}>
              {user && <Flex align={'center'} gap={2}>
                <Avatar src={user?.profilePic}/>
                <Text>{user?.fullName ? user?.fullName : user?.businessName}</Text>
              </Flex>}
              {user && <Divider mt={2}/>}
              {user && user.isBusinessAccount && <Link as={RouterLink} to={`/dashboard/${user.businessName}`}  _hover={{ color: 'blue.500' }}>Dashboard</Link>}
              {user && <Link as={RouterLink} to={'/dashboard/profile'}  _hover={{ color: 'blue.500' }}>My Profile</Link>}
              {user && <Link as={RouterLink} to={'/my-order'}  _hover={{ color: 'blue.500' }}>My Order</Link>}
              {!user && <Link as={RouterLink} to={'/login'}>
                <Button w={'full'} colorScheme='blue'>Login</Button>
              </Link>}
              {user && <Divider mb={2}/>}
              {user && <Button w={'full'} colorScheme='gray' onClick={handleLogout}>Logout</Button>}
            </Flex>
          </MenuList>
        </Menu>
        
      </Flex>
      
      <CartDrawer isOpenCart={isOpenCart} onCloseCart={onCloseCart}/>

      <SearchModel isOpen={isOpen} onClose={onClose}/>


    </Flex>
  )
}

export default Header
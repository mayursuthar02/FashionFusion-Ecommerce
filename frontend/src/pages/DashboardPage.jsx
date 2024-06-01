import { Avatar, Box, Divider, Flex, Link, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { NavLink, Outlet, Route, Link as RouterLink, Routes } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LuUser2 } from "react-icons/lu";
import { BsHandbag } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import { BiMessageDetail } from "react-icons/bi";

const DashboardPage = () => {
    const user = useRecoilValue(userAtom);
    const dashBoardLink = [
        { title: "Dashboard", link: `${user.businessName}`, icon: <RxDashboard/> },
        { title: "Profile", link: `profile`, icon: <LuUser2/> },
        { title: "Products", link: "products", icon: <BsHandbag/> },
        { title: "Orders", link: "orders", icon: <LuShoppingCart/> },
        { title: "Reviews", link: "reviews", icon: <BiMessageDetail/> },
    ]
    
  return (
    <Flex minH={'100vh'} display={'grid'} gridTemplateColumns={'.26fr 1fr'} gap={5} p={5}>
        <Box py={5} px={5} boxShadow={'lg'} borderRadius={'lg'}>
            <Flex alignItems={'center'} h={'fit-content'} px={5} gap={5}>
                <Avatar src={user?.profilePic ? user?.profilePic : ""} size={'lg'}/>
                <Text size={'md'} fontWeight={'500'} >{user?.businessName ? user?.businessName : user?.fullName}</Text>
            </Flex>
            <Divider borderColor={'#e5e5e5'} mt={5} mb={5}/>
            
            <Flex flexDir={'column'} gap={2}>
                {dashBoardLink.map((el,i) =>(
                    <NavLink 
                    key={i} 
                    to={el.link}   
                    _hover={{bgColor: 'blue.50', color:"blue.500"}} 
                    px={4} 
                    py={2} 
                    borderRadius={'md'}>
                        {({ isActive }) => (
                            <Box
                                px={4}
                                py={2}
                                borderRadius={'md'}
                                bg={isActive ? 'blue.50' : 'transparent'}
                                color={isActive ? 'blue.500' : 'inherit'}
                                _hover={{ bg: 'blue.50', color: 'blue.500' }}
                            >
                                <Flex alignItems={'center'} gap={2}>
                                    {el.icon}
                                    {el.title}
                                </Flex>
                            </Box>
                        )}
                    </NavLink>
                ))}
            </Flex>
        </Box>

        <Box py={5} px={5} boxShadow={'lg'} borderRadius={'lg'}>
            <Outlet/>
        </Box>
    </Flex>
  )
}

export default DashboardPage
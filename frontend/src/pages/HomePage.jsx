import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import {Box, Button, Divider, Flex, Grid, GridItem, Image, Img, Input, Link, Text} from '@chakra-ui/react';
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaPinterest } from "react-icons/fa6";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { LiaShippingFastSolid } from "react-icons/lia";
import { CgSupport } from "react-icons/cg";
import {Link as RouterLink} from 'react-router-dom';
import img1 from '../assets/1.webp';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.webp';
import img4 from '../assets/4.webp';
import img5 from '../assets/5.webp';

const HomePage = () => {
  const user = useRecoilValue(userAtom);
  return (
    <>
      <Grid 
      h={'500px'} 
      templateColumns={'repeat(4, 1fr)'}
      templateRows={'repeat(2, 1fr)'}
      mb={10} 
      gap={5} 
      px={'80px'} 
      mt={10}>
        <GridItem bg={'gray.200'} colSpan={2} rowSpan={2} overflow={'hidden'}>
          <Link as={RouterLink} to={'/men/tshirt/The-Evolve-Relaxed-Fit-T-shirt-Ultra-Soft/665c8788359337eaff0eb96c'} h={'full'} position={'relative'}>
            <Image src={img4} w={'full'} h={'full'} objectFit={'cover'} transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }}/>
          </Link>
        </GridItem>

        <GridItem bg={'gray.200'} overflow={'hidden'}>
          <Link as={RouterLink} to={'/men'} h={'full'} position={'relative'}>
            <Image src={img1} w={'full'} h={'full'} objectFit={'cover'} transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }}/>
            <Box pos={'absolute'} top={'40%'} left={'39%'} bgColor={'white'} px={5} py={2} letterSpacing={2}>MEN</Box>
          </Link>
        </GridItem>
        
        <GridItem bg={'gray.200'} overflow={'hidden'}>
          <Link as={RouterLink} to={'/women'} h={'full'} position={'relative'}>
            <Image src={img2} w={'full'} h={'full'} objectFit={'cover'} transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }}/>
            <Box pos={'absolute'} top={'40%'} left={'35%'} bgColor={'white'} px={5} py={2} letterSpacing={2}>WOMEN</Box>
          </Link>
        </GridItem>
        
        <GridItem bg={'gray.200'} colSpan={2} overflow={'hidden'}>
          <Link as={RouterLink} to={'/men/tshirt'} h={'full'} position={'relative'}>
            <Image src={img3} w={'full'} h={'full'} objectFit={'cover'} transition="transform 0.3s ease" _hover={{ transform: 'scale(1.05)' }}/>
          </Link>
        </GridItem>
      </Grid>

      <Grid templateColumns={'repeat(3,1fr)'} px={'80px'} gap={5} mb={10}>
        <Flex alignItems={'center'} gap={4}>
          <LiaShippingFastSolid fontSize={'40px'} color="#718096"/>
          <Box>
            <Text fontSize={'16px'} color={'gray.700'} fontWeight={'500'}>FREE SHIPPING</Text>
            <Text fontSize={'14px'} color={'gray.700'}>On all UA order or order above Rs. 999.00</Text>
          </Box>
        </Flex>

        <Flex alignItems={'center'} gap={4}>
          <MdOutlinePublishedWithChanges fontSize={'40px'} color="#718096"/>
          <Box>
            <Text fontSize={'16px'} color={'gray.700'} fontWeight={'500'}>30 DAYS RETURN</Text>
            <Text fontSize={'14px'} color={'gray.700'}>Simply return it within 30 days for an exchange</Text>
          </Box>
        </Flex>
        
        <Flex alignItems={'center'} gap={4}>
          <CgSupport fontSize={'40px'} color="#718096"/>
          <Box>
            <Text fontSize={'16px'} color={'gray.700'} fontWeight={'500'}>SUPPORT 24/7</Text>
            <Text fontSize={'14px'} color={'gray.700'}>Contact us 24 hours a day. 7 days a week</Text>
          </Box>
        </Flex>
      </Grid>
       
      <Divider mb={10}/>

      <Link as={RouterLink} to={'/men/tshirt'} bg={'gray.200'} h={'750px'}>
        <Image src={img5} w={'full'} h={'full'} objectFit={'cover'}/>
      </Link>

      <Divider my={10}/>

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
    </>
  )
}

export default HomePage
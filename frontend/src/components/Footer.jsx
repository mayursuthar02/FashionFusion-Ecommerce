import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';

import { GrLocation } from "react-icons/gr";
import { BsTelephone } from "react-icons/bs";
import { LuClock5 } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";

import Logo from './Logo';

import BASEURL from "../config/baseURL";


const Footer = () => {  
  const footerLink1 = [
    {title: "Men", path: '/men'},
    {title: "Women", path: '/women'},
    {title: "Accessories", path: '/accessories'},
    {title: "Beauty", path: '/beauty'},
  ];
  
  const footerLink2 = [
    {title: "About Us", path: ''},
    {title: "Contact Us", path: ''},
    {title: "Blog", path: ''},
    {title: "FAQs", path: ''},
  ];

  const footerLink3 = [
    {title: "Terms & Conditions", path: ''},
    {title: "Returns & Exchanges", path: ''},
    {title: "Shipping & Delivery", path: ''},
    {title: "Privacy Policy", path: ''},
  ];

  const footerLink = [
    {title: "categories", link: footerLink1}, 
    {title: "infomation", link: footerLink2}, 
    {title: "useful links", link: footerLink3}
  ];

  const contactDetails = [
    {title: "India, Gujarat, Surat-395010", icon: <GrLocation fontSize={'17px'}/>},
    {title: "+91 38(050) 12 34 567", icon: <BsTelephone fontSize={'17px'}/>},
    {title: "All weak 24/7", icon: <LuClock5 fontSize={'17px'}/>},
    {title: "fashionfusion@gmail.com", icon: <HiOutlineMail fontSize={'17px'}/>}
  ];

  return (
    <Box
      bg={'white'}
      color={'#121212'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          {footerLink.map((FLink) => (
            <Stack align={'flex-start'} key={FLink.title}>
              <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>{FLink.title}</Text>
              {FLink.link.map((link) => (
                <Link key={link.title} href={link.path} fontSize={'15px'} color={'gray.500'}>{link.title}</Link>
              ))}
            </Stack>
          ))}
          
          <Stack align={'flex-start'}>
            <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>Contact us</Text>
            {contactDetails.map((contact) => (
              <Flex key={contact.title} href={'#'} fontSize={'15px'} color={'gray.500'} alignItems={'center'} gap={2}>
                {contact.icon}
                {contact.title}
              </Flex>              
            ))}
          </Stack>
        </SimpleGrid>
      </Container>

      <Box py={10}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}>
          <Logo />
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          © 2024 Copyright. All rights reserved
        </Text>
      </Box>
    </Box>
  )
}

export default Footer
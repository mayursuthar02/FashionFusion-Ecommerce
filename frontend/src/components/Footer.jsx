import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Tag,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { GrLocation } from "react-icons/gr";
import { BsTelephone } from "react-icons/bs";
import { LuClock5 } from "react-icons/lu";
import { HiOutlineMail } from "react-icons/hi";
import Logo from './Logo';

const Footer = () => {
  return (
    <Box
      bg={'white'}
      color={'#121212'}>
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={'flex-start'}>
            <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>categories</Text>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Men</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Women</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Accessories</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Beauty</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>infomation</Text>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>About Us</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Contact Us</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>Blog</Link>
            <Link href={'#'} fontSize={'15px'} color={'gray.500'}>FAQs</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>useful links</Text>
            <Link href={'#'} fontSize={'15px'}color={'gray.500'}>Terms & Conditions</Link>
            <Link href={'#'} fontSize={'15px'}color={'gray.500'}>Returns & Exchanges</Link>
            <Link href={'#'} fontSize={'15px'}color={'gray.500'}>Shipping & Delivery</Link>
            <Link href={'#'} fontSize={'15px'}color={'gray.500'}>Privacy Policy</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'semibold'} fontSize={'18px'} letterSpacing={1} textTransform={'uppercase'}>Contact us</Text>
            <Flex href={'#'} fontSize={'15px'} color={'gray.500'} alignItems={'center'} gap={2}>
              <GrLocation fontSize={'17px'}/>
              India, Gujarat, Surat-395010
            </Flex>
            <Flex href={'#'} fontSize={'15px'} color={'gray.500'} alignItems={'center'} gap={2}>
              <BsTelephone fontSize={'17px'}/>
              +91 38(050) 12 34 567
            </Flex>
            <Flex href={'#'} fontSize={'15px'} color={'gray.500'} alignItems={'center'} gap={2}>
              <LuClock5 fontSize={'15px'}/>
              All weak 24/7
            </Flex>
            <Flex href={'#'} fontSize={'15px'} color={'gray.500'} alignItems={'center'} gap={2}>
              <HiOutlineMail fontSize={'17px'}/>
              fashionfusion@gmail.com
            </Flex>
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
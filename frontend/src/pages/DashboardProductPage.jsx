import {Box, Button, Divider, Flex, IconButton, Input, useDisclosure} from '@chakra-ui/react';
import {Search2Icon} from '@chakra-ui/icons';
import { FiPlusSquare } from "react-icons/fi";
import CreateProduct from '../components/CreateProduct';

const DashboardProductPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Box position={'relative'}>
          <Input placeholder='search products' pr={10}/>
          <IconButton aria-label='Search' icon={<Search2Icon size={'1.5rem'}/>} color={'gray.500'} bgColor={'transparent'} _hover={{bgColor: "transparent"}} position={'absolute'} right={0} translateY='-50%'/>
        </Box>
        <Button display={'flex'} alignItems={'center'} gap={2} colorScheme='blue' borderRadius={'md'} onClick={onOpen}>
          <FiPlusSquare/>
          Add Product
        </Button>
      </Flex>

      <Divider borderColor={'#e5e5e5'} my={5}/>

      <CreateProduct isOpen={isOpen} onClose={onClose}/>
    </>
  )
}

export default DashboardProductPage
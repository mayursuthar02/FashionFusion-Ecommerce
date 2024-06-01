import { Box, Button, Flex, FormControl, FormLabel, HStack, IconButton, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuUploadCloud } from "react-icons/lu";
import useShowToast from "../hooks/useShowToast";
import useUploadImage from "../hooks/useUploadImage";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { categories, menSubCategories } from "../helpers/categories";

const CreateProduct = ({isOpen,onClose}) => {
    const fileRef = useRef();
    const showToast = useShowToast();
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState("");
    
    const handleUploadProduct = async (e) => {
      setIsUploading(true);
      const file = e.target.files[0];
      try {
        if (images.length >= 9) {
          showToast("Error", "You can use up to 9 images", "error");
          setIsUploading(false);
          return;
        }
        const uploadImageCloudinary = await useUploadImage(file);
        setImages([...images, uploadImageCloudinary.url]);
        setIsUploading(false);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    const handleDeleteImage = (img) => {
      const filterImages = images.filter(image => image !== img);
      setImages(filterImages);
    }

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={'6xl'} motionPreset='slideInBottom'>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Product Details</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody display={'grid'} gridTemplateColumns={'1fr 1fr'} gap={5}>

            <Box px={5}>
              <FormControl mb={5}>
                <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Product Name</FormLabel>
                <Input type="text" borderRadius={'md'}/>
              </FormControl>

              <FormControl mb={5}>
                <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Brand Name</FormLabel>
                <Input type="text" borderRadius={'md'}/>
              </FormControl>

              <HStack gap={4}>
                <FormControl mb={5}>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Category</FormLabel>
                  <Select placeholder='Select category' value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((category,i) => (
                      <option key={i} value={category.value}>{category.title}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mb={5}>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Sub Category</FormLabel>
                  <Select placeholder='Select sub category'>
                    {category === "men" && menSubCategories.map((category,i) => (
                      <option key={i} value={category.value}>{category.title}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
            </Box>

            <Box px={5}>
                <Text mb={3} display={'flex'} alignItems={'center'} gap={1}>
                    <Text fontSize={'14px'} color={'blue.500'}>Upload an image</Text>
                    <Text fontSize={'14px'} color={'#888'}>(You can use up to 9 images)</Text>
                </Text>
                
                <Box display={'grid'} gridTemplateColumns={'repeat(5,1fr)'} gap={4} mb={6}>
                    {
                      images[0] &&
                        images.map((img,i) => (
                          <Box width={'100px'} height={'100px'} borderRadius={'md'} key={i} position={'relative'}>
                              <SmallCloseIcon position={'absolute'} top={-2} right={-2} bg={'blue.500'} color={'white'} p={1} rounded={'full'} fontSize={'27px'} border={'3px solid #fff'} cursor={'pointer'} onClick={() => handleDeleteImage(img)}/>
                            <Image src={img} width={'full'} height={'full'} objectFit={'cover'} borderRadius={'md'}/>
                          </Box>
                        ))
                    }
                    <Button width={'100px'} height={'100px'} border={'1px solid'} bg={'transparent'} borderColor={'gray.200'} display={'flex'} alignItems={'center'} justifyContent={'center'} borderRadius={'md'} cursor={'pointer'} _hover={{bgColor: 'gray.50'}} onClick={() => fileRef.current.click()} isLoading={isUploading}>
                        <LuUploadCloud fontSize={'25px'} color="gray" opacity={.7}/>
                        <Input type="file" ref={fileRef} hidden onChange={handleUploadProduct}/>
                    </Button>
                </Box>

                <Text fontSize={'14px'} color={'#888'} fontWeight={'400'} mb={2}>Description</Text>
                <Textarea borderRadius={'md'}/>
            </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3}>Create Product</Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
        
      </ModalContent>
    </Modal>
  );
};

export default CreateProduct

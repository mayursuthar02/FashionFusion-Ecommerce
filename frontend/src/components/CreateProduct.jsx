import { 
  Box, Button, Flex, FormControl, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, 
  ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Text, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuUploadCloud } from "react-icons/lu";
import { IoIosCloseCircle } from "react-icons/io";
import useShowToast from "../hooks/useShowToast";
import useUploadImage from "../hooks/useUploadImage";
import { SmallCloseIcon } from "@chakra-ui/icons";
import { categories, menSubCategories } from "../helpers/categories";
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const CreateProduct = ({isOpen,onClose}) => {
    const user = useRecoilValue(userAtom);
    const fileRef = useRef();
    const showToast = useShowToast();
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sizeInput, setSizeInput] = useState("");
    // Input For backend
    const [name, setName] = useState("");
    const [brandName, setBrandName] = useState(user.brandName);
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [sizes, setSizes] = useState([]);
    const [color, setColor] = useState("");
    const [material, setMaterial] = useState("");
    const [images, setImages] = useState([]);
    const [stock, setStock] = useState(0);
    const [discount, setDiscount] = useState(0);
    
    // Upload Product Images
    const handleUploadProductImages = async (e) => {
      setIsUploading(true);
      setLoading(true);
      const file = e.target.files[0];
      try {
        if (images.length >= 9) {
          showToast("Error", "You can use up to 9 images", "error");
          setIsUploading(false);
          return;
        }
        const uploadImageCloudinary = await useUploadImage(file);
        setImages([...images, uploadImageCloudinary.url]);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
        setLoading(false);
      }
    };
    // Delete uploaded images
    const handleDeleteImage = (img) => {
      const filterImages = images.filter(image => image !== img);
      setImages(filterImages);
    }
    
    // Handle size input on keypress
    const handleSizeInputKeyPress = (e) => {
      if (e.key === 'Enter' && sizeInput.trim() !== '') {
        setSizes([...sizes, sizeInput.toUpperCase().trim()]);
        setSizeInput('');
      }
    };
    // Delete size from size list
    const handleInputSizeDelete = (size) => {
      const filterSizes = sizes.filter(s => s !== size);
      setSizes(filterSizes);
    }
    
    // Hnadle Submit
    const handleSubmit = async() => {
      // console.log({name, brandName, category, subCategory, sizes, color, material, stock, price, discount, description, images});
      setLoading(true);
      try {
        const res = await fetch('/api/products/create', {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({name, brandName, category, subCategory, sizes, color, material, stock, price, discount, description, images})
        });
        const data = await res.json();
        if (name == "" || brandName == "" || category == "" || subCategory == "" || sizes == "" || color == "" || material == "" || stock == 0 || price ==0 || description == "" || images == "") {
          showToast("Error", "Fields is require", "error");
          return;  
        }
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        showToast("Success", "Product created", "success");
        onClose();
        setName("");
        setCategory("");
        setSubCategory("");
        setSizes([]);
        setColor("");
        setMaterial("");
        setStock(0);
        setPrice(0);
        setDiscount(0);
        setImages([]);
        setDescription("");
      } catch (error) {
        showToast("Error", error, "error");
        console.error(error);
      } finally {
        setLoading(false);
      }
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
                <Input type="text" borderRadius={'md'} value={name} onChange={e => setName(e.target.value)}/>
              </FormControl>

              <FormControl mb={5}>
                <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Brand Name</FormLabel>
                <Input type="text" borderRadius={'md'} value={brandName} onChange={e => setBrandName(e.target.value)}/>
              </FormControl>

              <HStack gap={4} mb={5}>
                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Category</FormLabel>
                  <Select placeholder='Select category' value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((category,i) => (
                      <option key={i} value={category.value}>{category.title}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Sub Category</FormLabel>
                  <Select placeholder='Select sub category' value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                    {category === "men" && menSubCategories.map((category,i) => (
                      <option key={i} value={category.value}>{category.title}</option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <HStack gap={4} mb={5} alignItems={'start'}>
                <Box w={'full'}>
                  <FormControl mb={2}>
                    <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Size</FormLabel>
                    <Input type="text" borderRadius={'md'} placeholder="ex.  xs, s, m, l, xl" value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyPress={handleSizeInputKeyPress}/>
                  </FormControl>
                  <Flex alignItems={'center'} gap={2} flexWrap={'wrap'}>
                    {sizes.length > 0 && sizes.map((size,i) => (
                      <Flex alignItems={'center'} gap={1} bgColor={'blue.500'} color={'white'} py={'5px'} px={2} borderRadius={'4px'}>
                        <Text key={i} fontSize={'12px'}>{size}</Text>
                        <IoIosCloseCircle color="white" cursor={'pointer'} onClick={() => handleInputSizeDelete(size)}/>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
                
                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Color</FormLabel>
                  <Input type="text" borderRadius={'md'} placeholder="ex. blue, red, green" value={color} onChange={e => setColor(e.target.value)}/>
                </FormControl>
              </HStack> 

              <HStack gap={4} mb={5}>
                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Material</FormLabel>
                  <Input type="text" borderRadius={'md'} placeholder="ex. cotton" value={material} onChange={e => setMaterial(e.target.value)}/>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Stock</FormLabel>
                    <NumberInput borderRadius={'md'} value={stock} onChange={(_, valueAsNumber) => setStock(valueAsNumber || 0)}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                </FormControl>    
              </HStack>

              <HStack>
                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Price (ex. ₹100)</FormLabel>
                    <NumberInput borderRadius={'md'} value={price} onChange={(_, valueAsNumber) => setPrice(valueAsNumber || 0)}> 
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                </FormControl>    

                <FormControl>
                  <FormLabel fontSize={'14px'} color={'#888'} fontWeight={'400'}>Discount (optional)</FormLabel>
                    <NumberInput borderRadius={'md'} value={discount} onChange={(_, valueAsNumber) => setDiscount(valueAsNumber || 0)}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
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
                        <Input type="file" ref={fileRef} hidden onChange={handleUploadProductImages}/>
                    </Button>
                </Box>

                <Text fontSize={'14px'} color={'#888'} fontWeight={'400'} mb={2}>Description</Text>
                <Textarea borderRadius={'md'} value={description} onChange={e => setDescription(e.target.value)}/>
            </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={loading}>Create Product</Button>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
        
      </ModalContent>
    </Modal>
  );
};

export default CreateProduct
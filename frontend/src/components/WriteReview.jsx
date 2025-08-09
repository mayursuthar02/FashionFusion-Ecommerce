import { Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react"
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import useShowToast from "../hooks/useShowToast";
import userAtom from '../atoms/userAtom';
import {useRecoilValue} from 'recoil';
import { baseURL as BASEURL } from "../config/baseURL";

const WriteReview = ({isOpen, onClose, product, setCallBackFunction}) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const showToast = useShowToast();
    
    
    const handleSubmit = async() => {
        if (text === "" || rating === 0) {
            showToast("Error", "Field is required", "error");
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch(`${BASEURL}/api/reviews/create`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                credentials: 'include',
                body: JSON.stringify({productId: product._id, rating, text, vendorId: product.vendorId })
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setCallBackFunction(prev => !prev);
            onClose();
            setRating(0);
            setText("");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    
    
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset='slideInBottom'
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent >
          <ModalHeader>Write a review</ModalHeader>

          <ModalCloseButton _hover={{bgColor: "blue.50"}}/>
          
          <ModalBody pb={6}>

            <Box>
                <Text color={'gray.500'} fontSize={'15px'} mb={2}>Give you rating</Text>
                <Flex alignItems={'center'} gap={2} fontSize={'20px'} mb={5}>
                    {[1, 2, 3, 4, 5].map((starValue) => (
                        <FaStar
                          key={starValue}
                          color={starValue <= rating ? "orange" : "#748298"}
                          cursor={"pointer"}
                          onClick={() => setRating(starValue)}
                        />
                    ))}
                </Flex>
            </Box>

            <FormControl>
                <FormLabel color={'gray.500'} fontSize={'15px'} fontWeight={'400'}>Review</FormLabel>
                <Input type="text" placeholder="write your review" value={text} onChange={e => setText(e.target.value)}/>
            </FormControl>
          </ModalBody>
          
          <Flex align={'center'} justifyContent={'end'} gap={4} mb={5} mr={6}>
            <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading} loadingText="Posting">Post</Button>
            <Button onClick={onClose}>Cancle</Button>
          </Flex>
        </ModalContent>
      </Modal>
  )
}

export default WriteReview
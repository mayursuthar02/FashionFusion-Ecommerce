import { useState } from "react";
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Badge, Box, Button, Flex, Image, Link, Text, useDisclosure } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import useShowToast from "../hooks/useShowToast";
import FetchVenderProductsData from "../helpers/FetchVenderProductsData";

import UpdateProduct from "./UpdateProduct";

import { baseURL as BASEURL } from "../config/baseURL";

const DashboardProductCard = ({ product}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  const fetchVenderProducts = FetchVenderProductsData();

  const showEditModel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
  }

  const showDeleteModel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onOpenAlert();
  }

  const handleProductDelete = async(id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASEURL}/api/products/delete/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "Error");
        return;
      }
      showToast("Success", "Product deleted", "success");
      fetchVenderProducts();
    } catch (error) {
      console.log(error);
      showToast("Error", error, "Error");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <>
      <Link 
        as={RouterLink} 
        to={`/${product.category}/${product.subCategory}/${product.name.split(" ").join("-")}/${product._id}`} 
        _hover={{ textDecoration: "none" }}
      >
        {/* Images */}
        <Box
          height={"370px"}
          borderRadius={"md"}
          overflow={"hidden"}
          position={"relative"}
          _hover={{
            "> .image-hover": { opacity: 1 },
            "> .image-main": { opacity: 0 },
          }}
        >
          <Image
            src={product.images[1]}
            className="image-hover"
            w={"full"}
            h={"full"}
            objectFit={"cover"}
            position={"absolute"}
            top={0}
            left={0}
            transition={".2s ease"}
            opacity={0}
          />
          <Image
            src={product.images[0]}
            className="image-main"
            w={"full"}
            h={"full"}
            objectFit={"cover"}
            position={"absolute"}
            top={0}
            left={0}
            transition={".2s ease"}
            opacity={1}
          />
          {product.stock == 0 && (
            <Badge
              position={"absolute"}
              top={2}
              left={2}
              bg={"blue.500"}
              color={"white"}
              fontSize={".7rem"}
              fontWeight={"600"}
              zIndex={1}
              p={"3px"}
              px={"8px"}
              borderRadius={'md'}
            >
              sold out
            </Badge>
          )}
          <Button
            position={"absolute"}
            top={10}
            right={2}
            transition={'.3s ease'}
            transitionDelay={'.1s'}
            className="showButton"
            size={'xs'}
            onClick={(e)=> showDeleteModel(e)}
          >
              DELETE
          </Button>

          <Button
            position={"absolute"}
            top={2}
            right={2}
            transition={'.3s ease'}
            className="showButton"
            size={'xs'}
            onClick={showEditModel}
          >
              EDIT
          </Button>

        </Box>

        
        {/* Details */}
        <Box mt={1} px={2}>
          <Text fontWeight={"600"} fontSize={"17px"} mb={1} mt={2}>
            {product.brandName}
          </Text>
          <Text lineHeight={"20px"} fontSize={"14px"} color={"gray.500"}>
            {product.name}
          </Text>
          <Flex mt={1} alignItems={"center"} gap={2}>
            <Text fontWeight={"600"} fontSize={"15px"}>
              Rs. {Math.floor(product.price - (product.price * product.discount) / 100)}
            </Text>
            <Text
              fontWeight={"500"}
              fontSize={"12px"}
              color={"gray.400"}
              style={{ textDecoration: "line-through" }}
            >
              Rs. {product.price}
            </Text>
            <Text color={"orange.300"} fontSize={"15px"}>
              ({product.discount}% OFF)
            </Text>
          </Flex>
        </Box>
      </Link>

      <UpdateProduct product={product} isOpen={isOpen} onClose={onClose}/>

      <AlertDialog
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You want to delete!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onCloseAlert}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={()=> handleProductDelete(product._id)} ml={3} loadingText="Deleting" isLoading={loading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DashboardProductCard;

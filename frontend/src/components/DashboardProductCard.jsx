import { Badge, Box, Button, Flex, Image, Link, Text, useDisclosure } from "@chakra-ui/react";
import UpdateProduct from "./UpdateProduct";
import { Link as RouterLink } from "react-router-dom";

const DashboardProductCard = ({ product}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showEditModel = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
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
            top={2}
            right={2}
            size={'xs'}
            onClick={showEditModel}
          >
              EDIT
          </Button>
        </Box>
        {/* Details */}
        <Box mt={1} px={2}>
          <Text fontWeight={"600"} fontSize={"17px"} mb={1}>
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
    </>
  );
};

export default DashboardProductCard;

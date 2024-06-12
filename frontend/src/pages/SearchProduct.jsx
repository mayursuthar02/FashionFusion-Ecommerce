import { Badge, Box, Flex, Grid, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const SearchProduct = () => {
  const query = useLocation();

  const [searchProducts, setSearchProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingList = new Array(10).fill(null);
  const navigate = useNavigate();
    
  useEffect(() => {
    if (!query) {
      navigate('/');
    }

    const getSearchProduct = async () => {
      try {
        const res = await fetch(`/api/products/v2/search`+query.search);
        const data = await res.json();
        if (data.error) {
          console.log(data.error);
          return;
        }
        setSearchProducts(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getSearchProduct();
  }, [query]);

  return (
    <Box minH={'90vh'} px={'50px'} py={10}>
        <Flex align={'center'} justify={'center'} bg={'gray.100'} px={'50px'} py={5} h={'200px'}>
            <Text my={2} fontSize={'30px'} fontWeight={'600'} textAlign={'center'} letterSpacing={2}>Result for "{query.search.split('=')[1]}"</Text>
        </Flex>

        <Grid templateColumns={'repeat(5,1fr)'} gap={5} mt={10}>
            {loading && loadingList.map((_,i) => (
                <Box key={i}>
                  <Skeleton height={'370px'} borderRadius={'md'}/>
                  <Skeleton height={'19px'} width={'150px'} mt={2} borderRadius={'md'}/>
                  <Skeleton height={'19px'} width={'120px'} mt={2} borderRadius={'md'}/>
                  <Skeleton height={'19px'} width={'200px'} mt={2} borderRadius={'md'}/>
                </Box>
            ))}

            {!loading && searchProducts.length > 0 && (
                searchProducts.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                ))
            )}
        </Grid>
    </Box>
  );
};

export default SearchProduct;

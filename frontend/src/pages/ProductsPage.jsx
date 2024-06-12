import { useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, Collapse, Flex, FormControl, Link, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Skeleton, Text, filter, useDisclosure } from "@chakra-ui/react"
import { Link as RouterLink, useParams } from "react-router-dom"

import { IoShareSocialSharp, IoCloseOutline } from "react-icons/io5";
import { PiSliders } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";
import { MdKeyboardArrowDown } from "react-icons/md";

import useShowToast from "../hooks/useShowToast";
import ProductCard from "../components/ProductCard";


const PRODUCTS_PER_PAGE = 25;

const ProductsPage = () => {
    let {category, subCategory} = useParams();
    const showToast = useShowToast();
    const { isOpen, onToggle } = useDisclosure();
    
    const [filterProperties, setFilterProperties] = useState({ brandNames: [],sizes : [], colors: [] });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const loadingList = new Array(15).fill(null);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    // Filter value Input
    const [priceRange, setPriceRange] = useState([100, 7000]);
    const [sizes, setSizes] = useState([]);
    const [brandNames, setBrandNames] = useState([]);
    const [colors, setColors] = useState([]);
        
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when component mounts or updates
    }, []);

    // Fetch filter properties
    useEffect(()=> {
        const fetchFilterProperties = async() => {
            const res = await fetch('/api/products/filter-properties');
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setFilterProperties({brandNames: data.brandName, sizes: data.sizes, colors: data.colors});
        };

        fetchFilterProperties();
    },[]);

    // Filter product
    useEffect(()=> {
        const fetchProductAndFilter = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/products/get-filter-product', {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({category, subCategory, sizes, minPrice: priceRange[0], maxPrice: priceRange[1], brandNames, colors})
                });
                const data = await res.json();
                setProducts(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndFilter();
    }, [category, sizes, priceRange, brandNames, colors, subCategory]);

    // Handle Page change pagination
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // Pagination
    const paginatedProducts = products.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );
    
    
  return (
    <>
    <Box bg={'gray.100'} px={'50px'} py={5}>
        <Flex alignItems={'center'} justifyContent={'space-between'}>
          <Flex align={'center'} gap={1} fontSize={'15px'} color={'gray.500'}>
            <Link to={'/'} as={RouterLink} >Home</Link>
            <span>/</span>
            <Link to={`/${category}`} as={RouterLink} color={'gray.900'} textTransform={'capitalize'}>{category}</Link>
            {subCategory && <span>/</span> }
            {subCategory && <Link to={`/${category}/${subCategory}`} as={RouterLink} color={'gray.900'} textTransform={'capitalize'}>{subCategory}</Link>}
          </Flex>
          
          <Flex alignItems={'center'} gap={1} color={'gray.500'} fontSize={'15px'}>
            <IoShareSocialSharp/>
            <Text>Share</Text>
          </Flex>
        </Flex>

        <Text my={2} fontSize={'30px'} fontWeight={'600'} textTransform={'uppercase'} textAlign={'center'} letterSpacing={2}>{category}</Text>
    </Box>

    <Flex align={'center'} justifyContent={'space-between'} px={'50px'} py={5}>
        <Flex align={'center'} gap={1} color={'gray.500'} cursor={'pointer'} onClick={onToggle} mr={12}>
            {!isOpen ? <PiSliders fontSize={'18px'}/> : <IoCloseOutline fontSize={'20px'}/>}
            <Text>FILTER</Text>
        </Flex>

        <RxDashboard size={'20px'} color="#718096"/>
        
        <Flex align={'center'} gap={1} color={'gray.500'} cursor={'pointer'}>
            <Text>BESTSELLERS</Text>
            <MdKeyboardArrowDown fontSize={'18px'}/>
        </Flex>
    </Flex>

    <Collapse in={isOpen}>
        <Box display={'grid'} gridTemplateColumns={'repeat(4,1fr)'} gap={2} height={'350px'} bg={'gray.100'} py={10} px={'200px'}>
            <Box>
                <Text fontSize={'17px'} fontWeight={'600'} mb={2} letterSpacing={1}>COLOR</Text>
                <FormControl display={'flex'} flexDir={'column'} height={'260px'} overflowY={'auto'} px={2} className="filterBox">
                    {filterProperties.colors.map(($color,i) => (
                        <Flex position={'relative'} key={i}>
                            <Box 
                                w={'25px'} 
                                h={'25px'} 
                                borderRadius={'full'} 
                                border={colors.includes($color) ? "3px solid" : "none"}
                                borderColor={'blue.500'}
                                style={{ backgroundColor: $color}} position={'absolute'} top={1} left={0} zIndex={1}></Box>
                            <Checkbox 
                                my={1} 
                                onChange={(e)=> 
                                e.target.checked ? 
                                    setColors([...colors, $color]) : 
                                    setColors(colors.filter((s) => s !== $color))
                                }
                                gap={3}
                                px={1}
                            >{$color}</Checkbox>
                        </Flex>
                    ))}
                </FormControl>
            </Box>

            <Box>
                <Text fontSize={'17px'} fontWeight={'600'} mb={2} letterSpacing={1}>SIZE</Text>
                <FormControl display={'grid'} gridTemplateColumns={'1fr 1fr'} height={'260px'} overflowY={'auto'} px={2} pr={20} className="filterBox">
                    {filterProperties.sizes.map(($size,i) => (
                        <Checkbox 
                            key={i}
                            my={1} 
                            onChange={(e)=> 
                                e.target.checked ? 
                                setSizes([...sizes, $size]) : 
                                setSizes(sizes.filter((s) => s !== $size))
                            }
                        >{$size}</Checkbox>
                    ))}
                </FormControl>
            </Box>

            <Box>
                <Text fontSize={'17px'} fontWeight={'600'} mb={2} letterSpacing={1}>BRAND</Text>
                <FormControl display={'flex'} flexDir={'column'} height={'260px'} overflowY={'auto'} px={2} className="filterBox">
                    {filterProperties.brandNames.map(($brandName,i) => (
                        <Checkbox 
                            key={i}
                            my={1} 
                            onChange={(e)=> 
                            e.target.checked ? 
                                setBrandNames([...brandNames, $brandName]) : 
                                setBrandNames(brandNames.filter((s) => s !== $brandName))
                        }
                    >{$brandName}</Checkbox>
                    ))}
                </FormControl>
            </Box>

            <Box>
                <Text fontSize={'17px'} fontWeight={'600'} mb={2} letterSpacing={1}>PRICE</Text>
                <FormControl display={'flex'} flexDir={'column'} height={'fit-content'} overflowY={'auto'} px={2} className="filterBox">
                    <RangeSlider aria-label={['min', 'max']} defaultValue={priceRange} min={100} max={10000} onChange={value => setPriceRange(value)} h={'25px'}>
                        <RangeSliderTrack>
                            <RangeSliderFilledTrack />
                        </RangeSliderTrack>
                        <RangeSliderThumb index={0} />
                        <RangeSliderThumb index={1} />
                    </RangeSlider>
                </FormControl>
                <Flex align={'center'} justifyContent={"space-between"} mt={5}>
                    <Box bg={'gray.200'} py={2} px={3} width={'100px'}>Rs. ${priceRange[0]}</Box>
                    <Box bg={'gray.200'} py={2} px={3} width={'100px'}>Rs. ${priceRange[1]}</Box>
                </Flex>
            </Box>
        </Box>
    </Collapse>
    
    {loading && (
        <Box display={'grid'} gridTemplateColumns={'repeat(5,1fr)'} gap={10} px={'50px'} my={10}>
          {loadingList.map((_,i) => (
            <Box key={i}>
              <Skeleton height={'370px'} borderRadius={'md'}/>
              <Skeleton height={'19px'} width={'150px'} mt={2} borderRadius={'md'}/>
              <Skeleton height={'19px'} width={'120px'} mt={2} borderRadius={'md'}/>
              <Skeleton height={'19px'} width={'200px'} mt={2} borderRadius={'md'}/>
            </Box>
          ))}
        </Box>
    )}

    {products.length > 0 && !loading ? (
        <Box display={'grid'} gridTemplateColumns={'repeat(5,1fr)'} gap={10} px={'50px'} my={10}>
            {paginatedProducts.length > 0 && (
                paginatedProducts.map((product) => (
                    <ProductCard key={product._id} product={product}/>
                ))
            )}
        </Box>
    ) : (
        <Flex alignItems={'center'} justifyContent={'center'} height={'60vh'}>
          <Text color={'gray.400'} fontSize={'30px'}>Product Not Found</Text>
        </Flex>
    )}

    {products.length >= 25 && 
    <Box mt={20} mb={10} display="flex" justifyContent="center">
        {[...Array(totalPages)].map((_, index) => (
          <Button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          bg={currentPage === index + 1 ? 'blue.500' : 'gray.200'}
          color={currentPage === index + 1 ? 'white' : 'black'}
          mx={1}
          _hover={{ bg: currentPage === index + 1 ? 'blue.600' : 'gray.100' }}
          >
            {index + 1}
          </Button>
        ))}
    </Box>}
    </>
  )
}

export default ProductsPage
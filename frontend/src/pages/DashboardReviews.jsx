import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Box, Button, Divider, Flex, Grid, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { FaStar } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import useShowToast from '../hooks/useShowToast';
import { format } from 'date-fns';

const DashboardReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const showToast = useShowToast();
  
  useEffect(()=>{
    const fetchReviews = async() => {
      try {
        const res = await fetch('/api/reviews/get-vender-product-reviews');       
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setReviews(data);

        if (data.length > 0) {
          // Calculate the sum of ratings
          const sumOfRatings = data.reduce((sum, review) => sum + review.rating, 0);
          // Calculate the average rating
          const avgRating = sumOfRatings / data.length;
          // Set the average rating, rounded to one decimal place
          setAverageRating(avgRating.toFixed(1));
        } else {
          setAverageRating('0.0');
        }


      } catch (error) {
        console.log(error);
      }
    };
    fetchReviews();
  },[]);

  const $5Star = reviews.filter((review) => review.rating === 5);
  const $4Star = reviews.filter((review) => review.rating === 4);
  const $3Star = reviews.filter((review) => review.rating === 3);
  const $2Star = reviews.filter((review) => review.rating === 2);
  const $1Star = reviews.filter((review) => review.rating === 1);
  const avg5Star = ($5Star.length * 100) / reviews?.length || 0;
  const avg4Star = ($4Star.length * 100) / reviews?.length || 0;
  const avg3Star = ($3Star.length * 100) / reviews?.length || 0;
  const avg2Star = ($2Star.length * 100) / reviews?.length || 0;
  const avg1Star = ($1Star.length * 100) / reviews?.length || 0;
  const avgPerStar = [
    { avgStar: avg5Star, peoples: $5Star.length, color: '#39baa0'},
    { avgStar: avg4Star, peoples: $4Star.length, color: '#dc7eff'},
    { avgStar: avg3Star, peoples: $3Star.length, color: '#f6bd3c'},
    { avgStar: avg2Star, peoples: $2Star.length, color: '#35c1f2'},
    { avgStar: avg1Star, peoples: $1Star.length, color: '#f47e1e'},
  ];
  
  return (
    <Box p={2} px={5}>
      <Text fontSize={'30px'} fontWeight={'500'} mb={5}>Reviews</Text>

      <Grid templateColumns={'repeat(3,1fr)'} px={'50px'} gap={10} mb={5}>
        <Stat borderRight={'1px solid #e5e5e5'} p={5}>
          <StatLabel fontSize={'20px'} fontWeight={'600'} mb={3}>Total Reviews</StatLabel>
          <Flex align={'center'} gap={5}>
            <StatNumber>{reviews.length} {reviews.length > 1000 ? "K" : ""}</StatNumber>
            <StatHelpText>
              <StatArrow type='increase' />
              21%
            </StatHelpText>
          </Flex>
          <Text color={'gray.500'} fontSize={'12px'} mt={2}>Growth in reviews on this year</Text>
        </Stat>

        <Stat borderRight={'1px solid #e5e5e5'} p={5}> 
          <StatLabel fontSize={'20px'} fontWeight={'600'} mb={3}>Average Rating</StatLabel>
          <Flex align={'center'} gap={5}>
            <Flex align={'center'} gap={5}>
              <StatNumber>{averageRating}</StatNumber>
              <Flex fontSize={'20px'} gap={1} align={'center'}>
                {[1, 2, 3, 4, 5].map((starValue) => (
                    <FaStar
                      key={starValue}
                      color={starValue <= Math.floor(averageRating) ? "orange" : "#748298"}
                    />
                ))}
              </Flex>
            </Flex>
          </Flex>
          <Text color={'gray.500'} fontSize={'12px'} mt={2}>Average rating on this year</Text>
        </Stat>

        <Stat p={5} >
          {avgPerStar.map((rating,i)=> (
            <Flex align={'start'} key={i} gap={2}>
              <FaStar color='#d5d5d5' fontSize={'11px'}/>
              <Text fontSize={'15px'} fontWeight={'500'}>{5 - i}</Text>
              <Box w={'150px'} h={'7px'} borderRadius={'50px'} position={'relative'}>
                <Flex align={'center'} w={'150px'} gap={2} position={'absolute'} top={0} left={0}>
                  <Box w={`${rating.avgStar}%`} h={'7px'} bg={rating.color} borderRadius={'50px'} transition="width 1s ease-in-out"></Box>
                  <Text fontSize={'12px'} fontWeight={'500'}>{rating.peoples}</Text>
                </Flex>
              </Box>
            </Flex>
          ))}
        </Stat>
      </Grid>

      
      <Grid templateColumns={'1fr'} gap={5}>
        
        {reviews.map((review) => (
          <Flex align={'start'} justifyContent={'space-around'} borderTop={'1px solid'} borderColor={'#e5e5e5'} py={8}>
            <Flex align={'center'} gap={3}>
              <Avatar src={review.userId.profilePic} borderRadius={'4px'}/>
              <Text fontSize={'20px'} fontWeight={'500'}>{review.userId.fullName ? review.userId.fullName : review.userId.businessName}</Text>
            </Flex>

            <Box>
              <Flex align={'center'} gap={4} mb={5}>
                <Flex fontSize={'15px'} gap={1} align={'center'}>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                      <FaStar
                        key={starValue}
                        color={starValue <= review.rating ? "orange" : "#748298"}
                      />
                  ))}
                </Flex>
                <Text fontSize={'13px'} color={'gray.500'}>{format(new Date(review.createdAt), 'dd-MM-yyyy')}</Text>
              </Flex>

              <Text mb={5} fontSize={'15px'} color={'gray.500'}>{review.text}</Text>
            </Box>

            <Box>
              <Flex align={'center'} gap={3}>
                <Avatar src={review.productId.images[0]} borderRadius={'4px'}/>
                <Text fontSize={'17px'} fontWeight={'500'}>{review.productId.name}</Text>
              </Flex>
              <Badge mt={5}>{review.productId.category}</Badge>
            </Box>
            
            <Button display={'flex'} alignItems={'center'} gap={2} border={'1px solid'} borderColor={'gray.200'} _hover={{bgColor: "gray.100"}} bgColor={'white'}>
                <MdDelete/>
                Delete
            </Button>
          </Flex>
        ))}
        
      </Grid>

    </Box>
  )
}

export default DashboardReviews
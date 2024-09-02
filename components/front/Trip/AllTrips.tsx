"use client";

import React, { useEffect, useState } from 'react';
import { Container, Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';
import Loading from '../loading/Loading';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Trip {
  _id: string;
  name: string;
  desc: string;
  day: string;
  price: number;
  images: string[];
}

const AllTrips: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('/api/trips');
        setTrips(response.data.trips);
      } catch (err) {
        setError('Failed to fetch trips.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ marginTop: '10px' }}
    >
      <Grid container        spacing={{ xs:0, lg: 4 }}  // Add spacing for smaller screens and no spacing for large screens
          justifyContent="center">
        <Grid item xs={12} md={4} lg={4}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Card
              sx={{
                maxWidth: 700,
                margin: 'auto',
                borderRadius: 2,
                boxShadow: 3,
                background: '#3a4a54',
                padding: { xs: 2, md: 4 },
                height: 'auto',
                marginBottom:'10px'
              }}
            >
              <Typography variant="h4" component="h2" sx={{ textAlign: 'center', color: '#fff' }} gutterBottom>
                Travel Details
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{ textAlign: 'center', color: '#fff', fontSize: { xs: '14px', md: '16px' } }}
                gutterBottom
              >
                It looks like you want to get travel details. Could you please clarify what specific details you need or the context you're working with? Are you looking to retrieve travel details from a database, or are you looking for general information about a trip in your project?
              </Typography>
              <Box>
                <Grid container spacing={4} sx={{ marginTop: 5 }}>
                  {['Number of Travel: 5', 'Number of Travel: 5', 'Number of Travel: 5', 'Number of Travel: 5'].map((text, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index}>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{
                          textAlign: 'center',
                          color: '#fff',
                          padding: '10px',
                          borderRadius: '10px',
                          background: '#4b748f',
                          height: '47px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: { xs: '16px', md: '18px' },
                        }}
                        gutterBottom
                      >
                        {text}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Card>
          </motion.div>
    

        </Grid>
        {[1, 2, 3].map((imgNum) => (
            <Grid item xs={12} sm={2} md={2}  key={imgNum}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: imgNum * 0.2 }}
                style={{ width: '99%', height: 'auto' }}
              >
        <Box
  sx={{
    borderRadius: '12px', // Adjust the radius as needed
    boxShadow: 3, // Material-UI shadow depth (1-24)
    overflow: 'hidden', // Ensures the border radius effect is visible
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
   margin:{xs:'10px 10px', md: "10px 25px"}  
  }}
>
  <Image
    src={`/en/${imgNum}.jpg`}
    width={300}
    height={180}
    style={{ width: '100%', height: 'auto' }}
    alt={`Trip Image ${imgNum}`}
  />
</Box>

              </motion.div>
            </Grid>
          ))}
    
        <Grid container      sx={{margin:{xs:'0 10px', md: "0 25px"}, marginTop: 5}}   spacing={{ xs:0, lg: 4 }}  // Add spacing for smaller screens and no spacing for large screens
          >
          {trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={trip._id}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Card
                  sx={{
                    maxWidth: 400,
                    height: 'auto',
                    margin: 'auto',
                    borderRadius: 2,
                    boxShadow: 3,
                    background: '#d7ddd9',
                    marginTop: 5
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={trip.name}
                    height="200"
                    image={trip.images[0] || '/default-image.jpg'}
                    sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2, height: '200px', objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {trip.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {trip.desc.length > 100 ? `${trip.desc.substring(0, 100)}...` : trip.desc}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6">${trip.price.toFixed(2)}</Typography>
                      <Link href={`/Trip/${trip._id}`} style={{ background: '#30404b', padding: '8px', borderRadius: '10px', color: 'wheat', textDecoration: 'none' }}>
                        View Details
                      </Link>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AllTrips;

"use client";

import React from 'react';
import { Container, Typography, Card, CardContent, Box, Button, Grid } from '@mui/material';
import Slider from 'react-slick';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Loading from '../loading/Loading';
import PayPalButton from '@/components/PayPalButton';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TripRating from './TripRating';
import PayPalModal from './PayPalModal';
import { motion } from 'framer-motion';

interface Trip {
  _id: string;
  name: string;
  desc: string;
  day: string;
  price: number;
  images: string[];
  user_id: string;
  endDate: string;
}

const TripDetails: React.FC = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const [trip, setTrip] = React.useState<Trip | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [Join, setJoin] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/trips/${id}`);
        setTrip(response.data.trip);

        if (session?.user) {
          const responses = await axios.get(`/api/Join`, { params: { email: session?.user?.email, id: response.data.trip._id } });
          setJoin(responses.data.Joins);
        }
      } catch (err) {
        setError('Failed to fetch trip details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id, session?.user]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 10 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ marginTop: '10px', padding: '25px' }}
    >
      {trip && (
        <>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ textAlign: 'center', color: '#0d47a1', fontWeight: 'bold' }}
            >
              {trip.name}
            </Typography>
          </motion.div>

          <Grid container spacing={4} sx={{ marginTop: 5 }}>
            <Grid item xs={12} sm={12} md={6}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Slider {...sliderSettings}>
                  {trip.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Trip image ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          borderRadius: '8px', 
                          objectFit: 'cover', 
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
                        }}
                      />
                    </div>
                  ))}
                </Slider>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Card
                  sx={{ 
                    p: 3, 
                    borderRadius: 2, 
                    backgroundColor: '#d7ddd9',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' 
                  }}
                >
                  <CardContent>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      sx={{ color: '#0d47a1', fontWeight: 'bold' }}
                    >
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, color: '#424242' }}>
                      {trip.desc}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ color: '#2e7d32', fontWeight: 'bold' }}
                      >
                        ${trip.price.toFixed(2)}
                      </Typography>

                      {session?.user ? (
                        Join === false ? (
                          <>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              sx={{ textTransform: 'none' }}
                              onClick={handleOpenModal}
                            >
                              Pay with PayPal
                            </Button>
                            <PayPalModal 
                              open={modalOpen} 
                              handleClose={handleCloseModal} 
                              tripId={trip._id} 
                              ownerId={trip.user_id} 
                              amount={trip.price} 
                            />
                          </>
                        ) : (
                          <Typography 
                            variant="body1" 
                            sx={{ color: '#2e7d32', fontWeight: 'bold' }}
                          >
                            YOU ARE JOINED
                          </Typography>
                        )
                      ) : (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          component={Link} 
                          href={'/auth/login'}
                          sx={{ textTransform: 'none' }}
                        >
                          Login to Join
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {session?.user && Join === true && new Date(trip.endDate) <= new Date() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <TripRating tripId={trip._id} endDate={trip.endDate} />
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default TripDetails;

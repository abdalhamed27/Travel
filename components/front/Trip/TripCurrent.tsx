'use client';

import React from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Grid, Button, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const TripCurrent: React.FC = () => {
  const { data: session } = useSession();
  const [trips, setTrips] = React.useState<any[]>([]);
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (session?.user) {
          const tripsResponse = await axios.get('/api/my-trips', {
            params: { email: session.user.email }
          });
          setTrips(tripsResponse.data.trips);

          const priceResponse = await axios.get('/api/total-price', {
            params: { email: session.user.email }
          });

          setTotalPrice(priceResponse.data.totalPrice);
        }
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [session]);

  if (loading) {
    return (
      <Container sx={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ marginTop: 10 }}>
        <Typography variant="h6" color="error" align="center">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 10 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        My Trips
      </Typography>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="textPrimary">
          Total Trips: {trips.length}
        </Typography>
        <Typography variant="h5" color="textPrimary">
          Total Price: ${totalPrice !== null ? totalPrice.toFixed(2) : 'Loading...'}
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {trips.length > 0 ? (
          trips.map((trip) => (
            <Grid item xs={12} sm={6} md={4} key={trip._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * trips.indexOf(trip) }}
              >
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={trip.images ? trip.images[0] : ' '} // Display the first image for the card preview
                    alt={trip.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" component="div">
                      {trip.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {trip.desc ? trip.desc.substring(0, 100) : ''}{trip.desc && trip.desc.length > 100 ? '...' : ''}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6" color="primary">
                        ${trip.price ? trip.price.toFixed(2) : ''}
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button variant="contained" color="primary" fullWidth>
                      <Link href={`/trips/${trip._id}`} passHref>
                        View Details
                      </Link>
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center">No trips found.</Typography>
        )}
      </Grid>
    </Container>
  );
};

export default TripCurrent;

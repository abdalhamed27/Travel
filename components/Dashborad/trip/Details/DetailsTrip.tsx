'use client';

import React, { useEffect, useState } from 'react';
import { Box, Card, CardHeader, Container, Grid, Typography, Rating } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const DetailsTrip: React.FC = () => {
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

  const { id } = useParams();
  const { data: session } = useSession();
  const [trips, setTrips] = useState<any>(null);
  const [personal, setPersonal] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/trips/details/${id}`);
        setTrips(response.data.trip);
        setPersonal(response.data.result ? response.data.result[0].persons : 0);
        setAverageRating(response.data.averageRating ? response.data.averageRating[0].averageRating : 0);
      } catch {
        setError('Failed to fetch trip details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id, session?.user]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, '0')} / ${String(date.getDate()).padStart(2, '0')}`;
  };

  const subtractDays = (date: string, days: number): string => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() - days);
    return formatDate(dateObj.toISOString());
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error}</Typography>;
  if (!trips) return <Typography>Trip not found.</Typography>;

  const startDate = subtractDays(trips.endDate, trips.day);
  const endDate = new Date(trips.endDate);
  const currentDate = new Date();

  const status = currentDate > new Date(startDate)
    ? (currentDate < endDate ? 'Trip started' : 'Trip finished')
    : 'Trip not started';

  return (
    <Container maxWidth={false} sx={{ mt: 4, padding: '25px' }}>
      <Grid container>
        <Grid item xs={12}>
          <Card sx={{ padding: '25px' }}>
            <CardHeader
              title={`Details for ${trips.name || ''}`}
              sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
            <Typography
              variant="h3"
              align="center"
              component="h1"
              sx={{ mb: 2, marginTop: 2 }}
            >
              {trips.name || ''}
            </Typography>
            <Grid container spacing={4} sx={{ marginTop: 1 }}>
              <Grid item xs={12} sm={12} md={6}>
                <Container sx={{ mt: 4, padding: '25px' }}>
                  <Box sx={{ maxWidth: '80%', height: '400px', overflow: 'hidden', position: 'relative' }}>
                    <Slider {...sliderSettings}>
                      {trips.images.map((image: string, index: number) => (
                        <div key={index}>
                          <img
                            src={image}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: '100%',
                              borderRadius: '8px',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </Box>
                </Container>
              </Grid>
              
              <Grid item xs={12} sm={12} md={6}>
                <Typography
                  variant="body1"
                  align="center"
                  component="p"
                  sx={{ mb: 2 }}
                >
                  {trips.desc || ''}
                </Typography>
                <Grid container spacing={4} sx={{ marginTop: 1 }}>
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      variant="body1"
                      align="left"
                      component="p"
                      sx={{
                        background: '#30404b',
                        color: '#FFF',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        marginTop: '20px',
                      }}
                    >
                      Start Date: {startDate}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      variant="body1"
                      align="left"
                      component="p"
                      sx={{
                        background: '#30404b',
                        color: '#FFF',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        marginTop: '20px',
                      }}
                    >
                      End Date: {formatDate(trips.endDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      variant="body1"
                      align="left"
                      component="p"
                      sx={{
                        background: '#30404b',
                        color: '#FFF',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        marginTop: '20px',
                      }}
                    >
                      Status: {status}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      variant="body1"
                      align="left"
                      component="p"
                      sx={{
                        background: '#30404b',
                        color: '#FFF',
                        borderRadius: '10px',
                        padding: '10px',
                        width: '100%',
                        marginTop: '20px',
                      }}
                    >
                      <Link href={`/Dashboard/Trip/users/${trips._id}`}>
                        Total Personnel: {personal}
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>

                {/* Rating Section */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Rating</Typography>
                  <Rating
                    name="trip-rating"
                    value={averageRating}
                    precision={0.5}
                    readOnly
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailsTrip;

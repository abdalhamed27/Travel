"use client";

import { useState, useEffect } from 'react';
import { Box, Typography, Rating } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

interface RatingProps {
  tripId: string;
  endDate: string; // Expecting a date string
}

const TripRating: React.FC<RatingProps> = ({ tripId, endDate }) => {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isRated, setIsRated] = useState<boolean>(false);
  const [canRate, setCanRate] = useState<boolean>(false);

  useEffect(() => {
    const checkEligibility = () => {
      const currentDate = new Date();
      const tripEndDate = new Date(endDate);

      if (currentDate > tripEndDate) {
        setCanRate(true);
      }
    };

    checkEligibility();

    // Fetch existing rating for the trip
    if (session?.user) {
      axios.get(`/api/trips/rating`, { params: { tripId } })
        .then(response => {
          if (response.data.averageRating) {
            setIsRated(true);
          }
          console.log(response.data.Rating);
          setAverageRating(response.data.Rating[0].averageRating || 0);
        })
        .catch(error => console.error('Failed to fetch rating:', error));
    }
  }, [session, tripId, endDate]);

  const handleRating = async (value: number) => {
    if (canRate) {
      const formData = new FormData();
      formData.append('tripId', tripId);
      formData.append('rating', value);
      formData.append('email', session?.user?.email);

      await axios.post(`/api/trips/rating`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Rate this Trip
        </Typography>
        <Rating
          name="trip-rating"
          value={userRating || averageRating}
          onChange={(event, newValue) => handleRating(newValue as number)}
          precision={0.5}
          readOnly={isRated}
          size="large"
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {isRated ? `Your Rating: ${userRating}` : `Average Rating: ${averageRating.toFixed(1)}`}
        </Typography>
        {!isRated && !canRate && (
          <Typography variant="body2" color="textSecondary">
            You can rate this trip after its end date.
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default TripRating;

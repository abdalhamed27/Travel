import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Typography } from '@mui/material';

const images = ['/en/Four.jpg'];

export default function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box sx={{ width: '100%', height: '700px', overflow: 'hidden', position: 'relative' }}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            alt={`Slide ${index + 1}`}
            sx={{ width: '100%', height: '700px', objectFit: 'cover' }}
          />
        ))}
      </Slider>
      <Box sx={{ position: 'absolute', top: '20%', width: '100%', marginTop: '20px', px: 4, color: 'white' }}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h1" align="center" sx={{ fontSize: { xs: '2.5rem', sm: '3rem', lg: '4rem' }, fontWeight: 'bold' }}>
            Global Explorer
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography variant="body1" align="center" sx={{ width: { xs: '100%', sm: '80%', lg: '40%' }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Explore the world with Global Explorer, where your adventure begins. Whether you're dreaming of a serene beach escape...
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

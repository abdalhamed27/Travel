  import React from 'react';
  import { Card, CardContent, CardMedia, Typography, Button, Grid, Box } from '@mui/material';

  const Feature = () => {
    return (
      <Box sx={{ marginTop: '50px', marginLeft:{xs:'0',md:'40px'}, paddingTop: '20px' }}>
        <Typography
        
          gutterBottom
          variant="h2"
          component="div"
          sx={{ color: '#30404b', textAlign: 'center', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
        >
          Feature Title
        </Typography>
        
        <Grid 
          container 
          spacing={{ xs:0, lg: 4 }}  // Add spacing for smaller screens and no spacing for large screens
          justifyContent="center"
        >
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{display:'flex',justifyContent:'center',marginTop:'10px'}}>
              <Card
                sx={{
                  maxWidth: 345,
                  boxShadow: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover .hover-content': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image="https://agazatours.com/wp-content/uploads/2021/04/Dahab-02.jpeg"
                  alt="Dahab"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Dahab Adventure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Experience the serene beauty of Dahab, a peaceful retreat that offers both adventure and relaxation.
                  </Typography>
                </CardContent>
                <Button size="small" sx={{ margin: '10px' }} color="primary" aria-label="Learn more about Dahab Adventure">
                  Learn More
                </Button>

                {/* Hover content */}
                <div
                  className="hover-content"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0,
                    transform: 'translateY(100%)',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ padding: '0 10px' }}>
                    More Info About Dahab Adventure
                  </Typography>
                  <Typography variant="body2">
                    Discover the hidden gems of Dahab, from its beautiful beaches to its rich cultural heritage. This is your gateway to an unforgettable adventure.
                  </Typography>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  export default Feature;

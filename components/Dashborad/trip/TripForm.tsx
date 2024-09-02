import { useState, useEffect } from 'react';
import { Container, Button, TextField, Typography, Box, Grid } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Trip {
  _id?: string;
  name: string;
  desc: string;
  day: string;
  price: number;
  endDate: string; // Add the endDate property
  images?: string[]; // List of image URLs for existing images
}

const TripForm = ({ children, onSuccess, trip }: { children: React.ReactNode, onSuccess: () => void, trip?: Trip }) => {
  const { data: session } = useSession();
  const [name, setName] = useState(trip ? trip.name : '');
  const [desc, setDesc] = useState(trip ? trip.desc : '');
  const [day, setDay] = useState(trip ? trip.day : '');
  const [price, setPrice] = useState<number>(trip ? trip.price : 0);
  const [endDate, setEndDate] = useState(trip ? trip.endDate : ''); // Add state for end date
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Populate existing images when trip is passed as prop
  useEffect(() => {
    if (trip && trip.images) {
      setExistingImages(trip.images);
    }
  }, [trip]);

  // Handle image file changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(filesArray);

      const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
      setPreviewImages(previewUrls);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('day', day);
    formData.append('price', price.toString());
    formData.append('endDate', endDate); // Append end date
    formData.append('email', session?.user?.email || '');

    // Append new images
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      if (trip?._id) {
        // Update existing trip
        formData.append('tripId', trip._id);

        await axios.post(`/api/trips`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Trip updated successfully!');
      } else {
        // Add new trip
        await axios.post('/api/trips', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Trip added successfully!');
      }
      // Reset form
      setName('');
      setDesc('');
      setDay('');
      setPrice(0);
      setEndDate(''); // Reset end date
      setImages([]);
      setPreviewImages([]);
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {trip ? 'Edit Trip' : 'Add New Trip'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          fullWidth
          multiline
          rows={4}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          required
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2, width: "100%" }}
        >
          Upload Images
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>

        {previewImages.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Image Previews
            </Typography>
            <Grid container spacing={2}>
              {previewImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <img
                    src={image}
                    alt={`preview-${index}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 4,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {existingImages.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Existing Images
            </Typography>
            <Grid container spacing={2}>
              {existingImages.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <img
                    src={image}
                    alt={`existing-${index}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 4,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
          {children}
        </Box>
      </form>
    </Container>
  );
};

export default TripForm;

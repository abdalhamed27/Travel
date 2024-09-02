"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Container, TextField, RadioGroup, FormControlLabel, Radio, Button, Typography, Box, Paper } from '@mui/material';
import { useTranslation } from '@/app/i18n/client';
import axios from 'axios';
import {  toast } from 'react-toastify';

type FormData = {
  userType: 'normal' | 'owner';
  username: string;
  email: string;
  password: string;
  companyName?: string;
  companyAddress?: string;
};

const Register = ({ trans }: { trans: string }) => {
  const { t } = useTranslation(trans);

  const [formData, setFormData] = useState<FormData>({
    userType: 'normal',
    username: '',
    email: '',
    password: '',
    companyName: '',
    companyAddress: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    
  // Create a new FormData object
  const formDatas = new FormData();
  
  // Append userType, username, email, password fields
  formDatas.append('userType', formData.userType);
  formDatas.append('username', formData.username);
  formDatas.append('email', formData.email);
  formDatas.append('password', formData.password);

  if (formData.userType === 'owner') {
    formDatas.append('companyName', formData.companyName || '');
    formDatas.append('companyAddress', formData.companyAddress || '');
  }

  try {
    // Send the FormData object via Axios
    const response = await axios.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // FormData requires this content type
      },
    });
    
    console.log('Form submitted:', formData);

    if (response.status === 201) {
      toast("Registration successful")
      console.log('Registration successful');
      // Redirect or show success message
    } else {
      console.log('Something went wrong:', response.data);
    }
  } catch (error) {
    console.error('Registration failed:', error);
  } finally {
    console.log('Form submission process completed.');
  }

    };
    


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
          zIndex: 1,
        },
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h5" align="center" gutterBottom>
            {t('Register')}
          </Typography>
          <form onSubmit={handleSubmit}>
            <RadioGroup
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              row
            >
              <FormControlLabel value="normal" control={<Radio />} label="Normal User" />
              <FormControlLabel value="owner" control={<Radio />} label="Travel Company Owner" />
            </RadioGroup>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            
            {formData.userType === 'owner' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="companyName"
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="companyAddress"
                  label="Company Address"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;

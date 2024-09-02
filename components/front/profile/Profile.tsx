'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Container, Typography, TextField, Button, Paper, Box, Avatar, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import Loading from '../loading/Loading';
import { verifyPassword } from '@/lib/Auth';

// Styled components for a more modern look
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.12)',
  background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `5px solid ${theme.palette.primary.main}`,
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1, 4),
  textTransform: 'none',
  boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
  },
}));

const Profile = () => {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [CName, setCName] = useState('');
  const [CAddress, setCAddress] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [Error, SetError] = useState('');
  const [HashPasswords, setHashPassword] = useState('');

  useEffect(() => {
    if (session?.user?.email) {
      axios.get('/api/profile/email', { params: { email: session.user.email } })
        .then(response => {
          const data = response.data;
          if (data.message) {
            setProfile(data.user);
            setName(data.user.username);
            setRole(data.user.role);
            setCName(data.user.CName || '');
            setCAddress(data.user.CAddress || '');
            setHashPassword(data.user.password)
            if (data.user.profileImage) {
              setPreviewImage(`/en/${data.user.profileImage}`);
            }
          }
        })
        .catch(error => console.error('Error fetching profile:', error));
    }
  }, [session]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
  
    try {
      const formData = new FormData();
      formData.append('email', session?.user?.email || '');
      formData.append('username', name);
      formData.append('CName', CName);
      formData.append('CAddress', CAddress);
      if (profileImage) formData.append('profileImage', profileImage);
      
      // Include old and new passwords if provided
      if (oldPassword) formData.append('oldPassword', oldPassword);
      if (newPassword) formData.append('newPassword', newPassword);
      formData.append('HashPassword', HashPasswords);
      
      const response = await axios.post('/api/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
       if(response.data.success==false){
        SetError(response.data.message)

       }
      setIsEditing(false);
      setProfile(response.data);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleEditClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(true);
    }, 2000);
  };

  if (!session?.user) return <Loading />;
  if (!session) return <Typography variant="h6" color="error">You must be logged in to view this page.</Typography>;

  return (
    <Container component="main" maxWidth="sm" sx={{ marginTop: 10, paddingTop: 10 }}>
      <StyledPaper elevation={3}>
        {Error}
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold', color: '#333' }}>Profile</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <StyledAvatar src={previewImage || ''} />
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : isEditing ? (
          <Box component="form" noValidate onSubmit={(e) => { e.preventDefault(); handleSave(); }} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              variant="outlined"
              InputLabelProps={{ style: { color: '#555' } }}
              InputProps={{ style: { borderRadius: 10, padding: '10px' } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              variant="outlined"
              InputLabelProps={{ style: { color: '#555' } }}
              InputProps={{ style: { borderRadius: 10, padding: '10px' } }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="outlined"
              InputLabelProps={{ style: { color: '#555' } }}
              InputProps={{ style: { borderRadius: 10, padding: '10px' } }}
            />
            {session?.user?.role === 'owner' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Company Name"
                  value={CName}
                  onChange={(e) => setCName(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { borderRadius: 10, padding: '10px' } }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Company Address"
                  value={CAddress}
                  onChange={(e) => setCAddress(e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ style: { color: '#555' } }}
                  InputProps={{ style: { borderRadius: 10, padding: '10px' } }}
                />
              </>
            )}
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <StyledButton variant="contained" color="primary" onClick={handleSave}>Save</StyledButton>
              </Grid>
              <Grid item xs={6}>
                <StyledButton variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>Cancel</StyledButton>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Email: <span style={{ color: '#666' }}>{profile?.email}</span></Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Name: <span style={{ color: '#666' }}>{profile?.username}</span></Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Role: <span style={{ color: '#666' }}>{profile?.role}</span></Typography>
            {profile?.userType === 'owner' && (
              <>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Company Name: <span style={{ color: '#666' }}>{profile?.CName}</span></Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Company Address: <span style={{ color: '#666' }}>{profile?.CAddress}</span></Typography>
              </>
            )}
            <StyledButton variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleEditClick}>Edit</StyledButton>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default Profile;

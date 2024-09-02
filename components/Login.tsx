"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Container, Paper, TextField, Button, Typography } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Loading from './front/loading/Loading';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true); // Start loading
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false); // Stop loading

    if (res?.ok) {
      const redirectTo = session?.user?.role === 'owner' ? '/Dashboard' : '/';
      router.replace(redirectTo); // Redirect based on user role
    } else if (res?.error) {
      setError(res.error);
    }
  };

  // if (status === 'loading' || loading) {
  //   return <Loading />; // Show loading component while session is being fetched or form is being submitted
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)', // Background image
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay
            zIndex: 1,
          },
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2 }}>
          <Paper elevation={3} sx={{ padding: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {error && <Typography color="error">{error}</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading} // Disable button when loading
                >
                  {loading ? 'Loading...' : 'Login'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Login;

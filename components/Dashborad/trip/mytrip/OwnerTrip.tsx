'use client';

import React from 'react';
import { Container, Typography, Grid, Paper, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const OwnerTrip: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchStatistics = async () => {
      try {
        if (session?.user) {
          const response = await axios.get('/api/owner-trips', { params: { email: session.user.email } });
          setStats(response.data);
        }
      } catch (err) {
        setError('Failed to fetch statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [session?.user]);

  if (loading) {
    return (
      <Container sx={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography variant="h6">Loading...</Typography>
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
    <Container maxWidth={false} sx={{ marginTop: 10 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Dashboard Statistics
      </Typography>
      
      <Grid container spacing={4}>
        {/* Total Joins and Revenue */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Total Joins
              </Typography>
              <Typography variant="h4" color="primary">
                {stats.totalJoins}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" color="primary">
                ${stats.totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
    
        {/* Revenue Over Time Chart */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom align="center">
              Revenue Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.revenueOverTime}>
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
    
        {/* Trip Statistics */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Trip Statistics
          </Typography>
          {Object.keys(stats.tripStatistics).map((tripName) => {
            const { tripDetails, joinCount, totalRevenue } = stats.tripStatistics[tripName];
            return (
              <Paper key={tripName} elevation={3} sx={{ mb: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {tripName}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {tripDetails.desc}
                </Typography>
                <Typography variant="body1">
                  <strong>Price:</strong> ${tripDetails.price}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Joins:</strong> {joinCount}
                </Typography>
                <Typography variant="body1">
                  <strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}
                </Typography>
              </Paper>
            );
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OwnerTrip;

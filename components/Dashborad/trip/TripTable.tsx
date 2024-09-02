'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Modal,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Pagination,
} from '@mui/material';
import axios from 'axios';
import TripForm from './TripForm';
import { useSession } from 'next-auth/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Header from '@/components/Headers/Header';
import Link from 'next/link';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Trip {
  _id: string;
  name: string;
  desc: string;
  day: string;
  price: number;
  rating: number;
  available: boolean;
  user_id: string; // Reference to User ID
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TripTable = () => {
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  const handleOpen = (trip: Trip | null = null) => {
    setCurrentTrip(trip);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const fetchTrips = async () => {
    try {
      const response = await axios.get('/api/trips', {
        params: { email: session?.user?.email },
      });
      setTrips(response.data.trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await axios.delete(`/api/trips/${id}`);
        fetchTrips(); // Refetch trips after deletion
      } catch (error) {
        console.error('Error deleting trip:', error);
        alert('Failed to delete the trip. Please try again.');
      }
    }
  };  

  useEffect(() => {
    fetchTrips();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading trips...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />

      {/* Page content */}
      <Container maxWidth={false} sx={{ mt: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="Trips"
                sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
              />

              <Modal open={open} onClose={handleClose}>
                <Box sx={modalStyle}>
                  <Typography variant="h6">
                    {currentTrip ? 'Update Trip' : 'Add New Trip'}
                  </Typography>
                  <TripForm trip={currentTrip} onSuccess={fetchTrips} />
                  <Button onClick={handleClose} sx={{ mt: 4 }} variant="contained" color="secondary">
                    Close
                  </Button>
                </Box>
              </Modal>

              <CardContent>
                <Button onClick={() => handleOpen()} variant="contained" color="primary" sx={{ mb: 4 }}>
                  Add New Trip
                </Button>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell><strong>Day</strong></TableCell>
                        <TableCell><strong>Price</strong></TableCell>
                        <TableCell><strong>Rating</strong></TableCell>
                        <TableCell><strong>Available</strong></TableCell>
                        <TableCell><strong>End Date</strong></TableCell>
                        <TableCell><strong>Actions</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {trips.map((trip) => (
                        <TableRow key={trip._id}>
                          <TableCell>{trip.name}</TableCell>
                          <TableCell>{trip.desc.length > 50 ? trip.desc.substring(0, 50) + '...' : trip.desc}</TableCell>
                          <TableCell>{trip.day}</TableCell>
                          <TableCell>${trip.price.toFixed(2)}</TableCell>
                          <TableCell>{trip.rating}</TableCell>
                          <TableCell>{trip.available ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{trip.endDate ? trip.endDate : ''}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleOpen(trip)} color="primary">
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(trip._id)} color="error">
                              <DeleteIcon />
                            </IconButton>
                            <Link href={`Trip/${trip._id}`}>
                              <VisibilityIcon />
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>

              <CardActions>
                <Pagination
                  count={3}
                  color="primary"
                  sx={{ marginLeft: "auto" }}
                />
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default TripTable;

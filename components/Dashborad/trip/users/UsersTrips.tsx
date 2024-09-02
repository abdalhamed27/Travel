'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Pagination,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const UsersTrips: React.FC = () => {
  const { id } = useParams();
  const { data: session } = useSession();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/trips/users/${id}`);
        setTrips(response.data.trip);
      } catch (err) {
        setError('Failed to fetch trip details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTrip();
  }, [id, session?.user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  if (!trips.length) {
    return <Typography>No trips found.</Typography>;
  }

  return (
    <Container maxWidth={false} sx={{ mt: 4 }}>
      <Grid container>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="User Trips"
              sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
            />
            <CardContent>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Image</strong></TableCell>
                      <TableCell><strong>Phone</strong></TableCell>
                      <TableCell><strong>Personal</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip._id}>
                        <TableCell>{trip?.userDetails?.username}</TableCell>
                        <TableCell>{trip?.userDetails?.email}</TableCell>
                        <TableCell>
                          <Image
                            src={`/en/${trip?.userDetails?.profileImage}`}
                            alt="Profile Image"
                            width={100}
                            height={100}
                          />
                        </TableCell>
                        <TableCell>{trip?.phone}</TableCell>
                        <TableCell>{trip?.persons}</TableCell>
                        <TableCell>
                          <Link href={`whatsapp://send?text=Join us on the trip!&phone=+${trip?.phone}`}>
                            <IconButton>
                              <WhatsAppIcon />
                            </IconButton>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Pagination count={3} color="primary" sx={{ marginLeft: "auto" }} />
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UsersTrips;

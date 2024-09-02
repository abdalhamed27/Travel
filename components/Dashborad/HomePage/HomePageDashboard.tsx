'use client';

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Header from "@/components/Headers/Header.js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSession } from "next-auth/react";
import axios from "axios";

const HomePageDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const [Trips, setTrips] = useState();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/statistics/Charts/${session?.user?.email}`);
        setTrips(response.data);
      } catch (err) {
        // Handle error
      } finally {
        // Cleanup or loading state
      }
    };

    if (session?.user) fetchTrip();
  }, [session?.user]);

  const trips = [
    { name: 'Trip A', status: 'completed', distance: 4000 },
    { name: 'Trip B', status: 'completed', distance: 3000 },
    { name: 'Trip C', status: 'in-progress', distance: 2000 },
    { name: 'Trip D', status: 'completed', distance: 2780 },
    { name: 'Trip E', status: 'canceled', distance: 1890 },
    { name: 'Trip F', status: 'completed', distance: 2390 },
    { name: 'Trip G', status: 'in-progress', distance: 3490 },
  ];

  const statistics = trips.reduce((acc, trip) => {
    if (!acc[trip.status]) {
      acc[trip.status] = { name: trip.status, uv: 0 };
    }
    acc[trip.status].uv += trip.distance;
    return acc;
  }, {});

  const data = Object.values(statistics).map(stat => ({
    name: stat.name,
    uv: stat.uv,
    pv: 0,
    amt: 0,
  }));

  return (
    <>
      <Header />
      <Container sx={{ mt: -7 }} maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} xl={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "primary.main", color: "white" }}
                title={
                  <>
                    <Typography variant="subtitle1">Overview</Typography>
                    <Typography variant="h4">Trips</Typography>
                  </>
                }
              />
              <CardContent>
                {/* Uncomment and customize the BarChart as needed */}
                {/* <BarChart
                  width={1000}
                  height={300}
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} xl={8}>
            <Card>
              <CardHeader
                title={<Typography variant="h5">Page visits</Typography>}
                action={
                  <Button variant="contained" color="primary" size="small">
                    See all
                  </Button>
                }
              />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Page name</TableCell>
                      <TableCell>Visitors</TableCell>
                      <TableCell>Unique users</TableCell>
                      <TableCell>Bounce rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>/argon/</TableCell>
                      <TableCell>4,569</TableCell>
                      <TableCell>340</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ArrowUpward color="success" sx={{ mr: 1 }} />
                          46.53%
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>/argon/index.html</TableCell>
                      <TableCell>3,985</TableCell>
                      <TableCell>319</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <ArrowDownward color="warning" sx={{ mr: 1 }} />
                          46.53%
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} xl={4}>
            <Card>
              <CardHeader
                title={<Typography variant="h5">Social traffic</Typography>}
                action={
                  <Button variant="contained" color="primary" size="small">
                    See all
                  </Button>
                }
              />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Referral</TableCell>
                      <TableCell>Visitors</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Facebook</TableCell>
                      <TableCell>1,480</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" sx={{ mr: 2 }}>60%</Typography>
                          <LinearProgress variant="determinate" value={60} sx={{ flexGrow: 1 }} color="error" />
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Google</TableCell>
                      <TableCell>4,807</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" sx={{ mr: 2 }}>80%</Typography>
                          <LinearProgress variant="determinate" value={80} sx={{ flexGrow: 1 }} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePageDashboard;

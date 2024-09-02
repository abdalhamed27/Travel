'use client'
import React, { useEffect, useState } from "react";
import { Container, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { BarChart, PieChart, People, Percent } from "@mui/icons-material";
import axios from "axios";
import { useSession } from "next-auth/react";

function Header() {
  const [Trips, setTrips] = useState();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await axios.get(`/api/statistics/${session?.user?.email}`);
        setTrips(response.data);
      } catch (err) {
        // Handle error
      } finally {
        // Finalize
      }
    };

    if (session?.user) fetchTrip();
  }, [session?.user]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "primary.dark",
          pb: 8,
          pt: 5,
          pt: { md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Box>
            {/* Card stats */}
            <Grid container spacing={4}>
              <Grid item lg={6} xl={3}>
                <Card>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Number of Trips
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {Trips?.tripCount}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ ml: 'auto' }}>
                        <Box
                          sx={{
                            backgroundColor: "error.main",
                            color: "white",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <BarChart />
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <span style={{ color: "success.main" }}>
                        <i className="fa fa-arrow-up" /> {Trips?.tripCounts / Trips?.tripCount * 100}%
                      </span>{" "}
                      <span>Current month</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={6} xl={3}>
                <Card>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Number of User Trips
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {Trips?.allUserCount}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ ml: 'auto' }}>
                        <Box
                          sx={{
                            backgroundColor: "warning.main",
                            color: "white",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <PieChart />
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <span style={{ color: "error.main" }}>
                        <i className="fas fa-arrow-down" /> {Trips?.allUserCount}
                      </span>{" "}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={6} xl={3}>
                <Card>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Number of Finished Trips
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {Trips?.tripsEndedCount}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ ml: 'auto' }}>
                        <Box
                          sx={{
                            backgroundColor: "warning.light",
                            color: "white",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <People />
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <span style={{ color: "warning.main" }}>
                        <i className="fas fa-arrow-down" /> {Trips?.tripsEndedThisMonthCount / Trips?.tripsEndedCount * 100}%
                      </span>{" "}
                      <span>Finished Trips Last Month</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={6} xl={3}>
                <Card>
                  <CardContent>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Number of Current Trips
                        </Typography>
                        <Typography variant="h4" fontWeight="bold">
                          {Trips?.tripsCurrentCount}
                        </Typography>
                      </Grid>
                      <Grid item sx={{ ml: 'auto' }}>
                        <Box
                          sx={{
                            backgroundColor: "info.main",
                            color: "white",
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: 3,
                          }}
                        >
                          <Percent />
                        </Box>
                      </Grid>
                    </Grid>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      <span style={{ color: "success.main" }}>
                        <i className="fas fa-arrow-up" /> {Trips?.tripsCurrentThisMonthCount / Trips?.tripsCurrentCount * 100}%
                      </span>{" "}
                      <span>Current month</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Header;

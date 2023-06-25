import React from 'react';
import { Typography, Container, Grid, Box } from '@mui/material';
import { Lock, CloudUpload, History, SupervisorAccount, LocalHospital } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function About() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Uvt Med Hyperledger Fabric Blockchain App
        </Typography>
        <Typography variant="body1" paragraph>
          Uvt Med is a secure and efficient patient management app built on the Hyperledger Fabric blockchain technology. It aims to streamline and enhance the healthcare system by providing advanced features and functionalities for both patients and healthcare professionals.
        </Typography>
        <Typography variant="h5" gutterBottom>
          Key Features:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: theme.palette.background.paper, padding: 2 }}>
              <Typography variant="body2" component="div">
                <strong><Lock fontSize="small" /> Patient-Controlled Access:</strong> Patients have the ability to grant or revoke access to their medical records for doctors. This ensures that patients have full control over who can view their sensitive information.
              </Typography>
              <Typography variant="body2" component="div">
                <strong><CloudUpload fontSize="small" /> Data Transfer:</strong> Patients can securely transfer their medical data from one doctor to another, enabling seamless continuity of care and avoiding duplication of tests or treatments.
              </Typography>
              <Typography variant="body2" component="div">
                <strong><CloudUpload fontSize="small" /> Altceva :</strong> Patients can securely transfer their medical data from one doctor to another, enabling seamless continuity of care and avoiding duplication of tests or treatments.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: theme.palette.background.paper, padding: 2 }}>
              <Typography variant="body2" component="div">
                <strong><History fontSize="small" /> Patient History:</strong> The app maintains a comprehensive history of patient records, including medical conditions, treatments, medications, and test results. This allows doctors to access relevant information quickly and make informed decisions.
              </Typography>
              <Typography variant="body2" component="div">
                <strong><SupervisorAccount fontSize="small" /> Admin Functionality:</strong> An admin page is available for authorized personnel to perform administrative tasks. This includes managing patient access control, approving data transfers, and registering new patients in the system.
              </Typography>
              <Typography variant="body2" component="div">
                <strong><LocalHospital fontSize="small" /> Doctor's Page:</strong> Doctors have their own dedicated pages where they can register patients, review and approve data transfers, and access patient records. This facilitates efficient patient management and collaboration among healthcare professionals.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body1" paragraph>
          Uvt Med is designed to prioritize data security, privacy, and patient empowerment. By leveraging the power of Hyperledger Fabric blockchain technology, the app ensures tamper-proof and transparent storage of patient data while granting patients greater control over their medical information.
        </Typography>
        <Typography variant="body1" paragraph>
          Experience a modern and secure patient management solution with Uvt Med Hyperledger Fabric Blockchain App today.
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default About;

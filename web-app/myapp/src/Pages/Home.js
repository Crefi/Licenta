import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import MedicalImage from '../components/Images/med.svg';

const HomeContainer = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
}));

const Description = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const FeatureList = styled('ul')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  paddingLeft: theme.spacing(4),
}));

function Home() {
  return (
    <HomeContainer container justifyContent="center" alignItems="center">
      <Grid item md={6}>
        <img src={MedicalImage} alt="Med" style={{ maxWidth: '100%' }} />
      </Grid>
      <Grid item md={6}>
        <Title variant="h4">Uvt Med Hyperledger Fabric Blockchain App</Title>
        <Description variant="body1">
          A secure and efficient solution for patient management using Hyperledger Fabric blockchain technology.
        </Description>
        <FeatureList>
          <li>Effortlessly manage patient records</li>
          <li>Securely store patient data on the blockchain</li>
          <li>The Patient Has The POWER FOR THESE RECORDS</li>
        </FeatureList>
        <Button variant="contained" color="primary" component={Link} to="/login">
          Get Started
        </Button>
      </Grid>
    </HomeContainer>
  );
}

export default Home;

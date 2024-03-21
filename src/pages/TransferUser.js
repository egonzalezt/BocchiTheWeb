import { Helmet } from 'react-helmet-async';
import { Container, Typography } from '@mui/material';
import { TransferUserForm } from '../sections/client';

export default function AddClientPage() {

  return (
    <>
      <Helmet>
        <title> Transfer | AgileDevs </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Realizar transferencia
        </Typography>

        <TransferUserForm/>
      </Container>
    </>
  );
}
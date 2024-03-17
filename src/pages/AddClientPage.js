import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';
import { ClientForm } from '../sections/client';

export default function AddClientPage(props) {
  const theme = useTheme();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Dashboard | AgileDevs </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          {id? "Editar archivo":"Registrar archivo"}
        </Typography>

        <ClientForm id={id} />
      </Container>
    </>
  );
}
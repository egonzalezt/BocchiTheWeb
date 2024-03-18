import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';

// ----------------------------------------------------------------------

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <>
      <Helmet>
        <title> 404 página no encontrada| AgileDevs </title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Lo sentimos, ¡página no encontrada!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Lo sentimos, no hemos podido encontrar la página que busca. ¿Quizá ha escrito mal la URL?
          </Typography>

          <Box
            component="img"
            src="/assets/illustrations/bocchi404.png"
            sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
          />

          <Button to="/dashboard" size="large" variant="contained" component={RouterLink}>
            Ir a la página principal
          </Button>
        </StyledContent>
      </Container>
    </>
  );
}

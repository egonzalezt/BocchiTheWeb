import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography } from '@mui/material';
// import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
// import Iconify from '../components/iconify';
// sections
import { SignUpForm } from '../sections/auth';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

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

export default function SignUpPage() {
  const mdUp = useResponsive('up', 'md');
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title> Registro | AgileDevs </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            width: 100,
            height: 100,
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hola, bienvenido
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Registrar cuenta en AgileDevelopers
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              ¿Ya posee una  cuenta?  {''}
              <Link onClick={handleClick} variant="subtitle2">Iniciar sesion</Link>
            </Typography>
            <SignUpForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

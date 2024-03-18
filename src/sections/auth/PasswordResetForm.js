import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, Alert, AlertTitle, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import KeroAuthApi from '../../services/keroAuth';

export default function PasswordResetForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleClick = async () => {
    setEmailError('');
    setLoginError('');
    setIsLoading(true); // Activar el estado de carga

    let isValid = true;

    if (email.trim() === '') {
      setEmailError('Correo electrónico es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Correo electrónico inválido');
      isValid = false;
    }

    if (isValid) {
      try {
        const response = await KeroAuthApi.requestPasswordReset({ email });
        const { email: resetEmail } = response.data; // Obtener el email de la respuesta
        enqueueSnackbar(`Se ha enviado un correo electrónico a ${resetEmail} para restablecer la contraseña`, { variant: 'success' });
        navigate('/');
      } catch (error) {
        setLoginError('No se pudo solicitar el restablecimiento de contraseña. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false); // Desactivar el estado de carga después de la solicitud
      }
    } else {
      setIsLoading(false); // En caso de error, también desactivar el estado de carga
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Correo Electrónico"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!emailError}
          helperText={emailError}
        />
      </Stack>

      {loginError && (
        <Alert severity="error" sx={{ my: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {loginError}
        </Alert>
      )}
      <Box mt={2}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          onClick={handleClick}
          loading={isLoading}
          >
          Restablecer contraseña
        </LoadingButton>
      </Box>
    </>
  );
}

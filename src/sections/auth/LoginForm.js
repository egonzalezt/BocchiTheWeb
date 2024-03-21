import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../components/iconify';
// Apis
import KeroAuthApi from '../../services/keroAuth'; // Import the KeroAuthApi
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const handleClick = () => {
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    let isValid = true;

    if (email.trim() === '') {
      setEmailError('Correo electrónico es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Correo electrónico inválido');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Contraseña es requerida');
      isValid = false;
    }

    if (isValid) {
      setLoading(true); // Establecer estado de carga a true durante la solicitud

      KeroAuthApi.login({ email, password })
        .then((response) => {
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          navigate('/dashboard', { replace: true });
        })
        .catch(() => {
          setLoginError('Credenciales inválidas. Por favor, verifique su correo electrónico y contraseña.');
        })
        .finally(() => {
          setLoading(false); // Establecer estado de carga a false después de la solicitud
        });
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPasswordClick = () => {
    navigate('/passwordReset'); // Redirige a la página de restablecimiento de contraseña
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

        <TextField
          name="password"
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!passwordError}
          helperText={passwordError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {loginError && (
        <Alert severity="error" sx={{ my: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {loginError}
        </Alert>
      )}

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link variant="subtitle2" underline="hover" onClick={handleForgotPasswordClick}>
          ¿Ha olvidado su contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={loading}>
        Inicio de sesión
      </LoadingButton>
    </>
  );
}

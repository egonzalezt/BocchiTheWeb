import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../components/iconify';
// States
import useUserStore from '../../stateStore/zustand';
// Apis
import AuthApi from '../../services/auth'; // Import the AuthApi
import UserApi from '../../services/user'; // Import the UserApi/ Import useSnackbar hook
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

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
      AuthApi.login({ email, password })
        .then((response) => {
          const { accessToken, refreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // Get the user information and save it into Zustand state
          UserApi.getUser()
            .then((userResponse) => {
              const user = userResponse.data;
              setUser(user);
            })
            .catch((error) => {
              // Handle error when getting user information
              console.error('Failed to get user information:', error);
            });

          navigate('/dashboard', { replace: true });
        })
        .catch((error) => {
          setLoginError('Credenciales inválidas. Por favor, verifique su correo electrónico y contraseña.');
        });
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
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" underline="hover">
          ¿Ha olvidado su contraseña?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Inicio de sesión
      </LoadingButton>
    </>
  );
}
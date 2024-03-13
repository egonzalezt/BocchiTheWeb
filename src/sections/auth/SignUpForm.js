import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, IconButton, InputAdornment, Stack, TextField, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Iconify from '../../components/iconify';
import AuthApi from '../../services/auth'; // Import the AuthApi

// Custom styled Grid item for adjusting alignment
const AlignedGridItem = styled(Grid)(({ theme, isError }) => ({
  display: 'flex',
  alignItems: isError ? 'flex-start' : 'center',
}));

export default function SignUpForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [isSuccess, setIsSuccess] = useState(false); // Add success state
  const [error, setError] = useState(null); // Add error state

  // State variables for form fields
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailBlur = async () => {
    if (email.trim() !== '') {
      try {
        const { data: emailExists } = await AuthApi.checkEmailExistence(email);

        if (emailExists) {
          setEmailError('El correo ingresado ya existe');
        } else {
          setEmailError('');
        }
      } catch (error) {
        console.error('Failed to check email existence:', error);
      }
    }
  };

  const handleSignUp = async () => {
    // Reset validation errors
    setNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneNumberError('');
    setPasswordError('');

    // Validate form fields
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Nombre es requerido');
      isValid = false;
    } else if (name.length > 100) {
      setNameError('Nombre no debe exceder los 100 caracteres');
      isValid = false;
    }

    if (lastName.trim() === '') {
      setLastNameError('Apellidos es requerido');
      isValid = false;
    } else if (lastName.length > 100) {
      setLastNameError('Apellidos no deben exceder los 100 caracteres');
      isValid = false;
    }

    if (email.trim() === '') {
      setEmailError('Correo electrónico es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Correo electrónico inválido');
      isValid = false;
    }

    if (phoneNumber.trim() === '') {
      setPhoneNumberError('Número de teléfono es requerido');
      isValid = false;
    } else if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError('Número de teléfono debe tener 10 dígitos');
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError('Contraseña es requerida');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        'Contraseña inválida. Debe contener al menos 10 caracteres, una mayúscula, una minúscula y un carácter especial.'
      );
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true); // Set loading state to true

      try {
        // Check if the email already exists
        const { data: emailExists } = await AuthApi.checkEmailExistence(email);

        if (emailExists) {
          setEmailError('El correo ingresado ya existe');
          setIsLoading(false); // Set loading state to false
          return;
        }

        const userDto = {
          firstName: name,
          lastName,
          email,
          phoneNumber,
          password,
        };

        await AuthApi.registerUser(userDto);
        setIsLoading(false); // Set loading state to false
        setIsSuccess(true); // Set success state to true
        navigate('/login'); // Redirect to the dashboard on successful registration
      } catch (error) {
        setIsLoading(false); // Set loading state to false
        setIsSuccess(false); // Set success state to false
        setError(error.response?.data?.message || 'Fallo el registro, valide si posee algun error en los campos e intente nuevamente.'); // Set error message from the response
      }
    }
  };

  // Function to validate email format
  const isValidEmail = (email) => {
    // Use a regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Function to validate password format
  const isValidPassword = (password) => {
    // Use a regular expression to validate password format
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
    return passwordRegex.test(password);
  };

  return (
    <Stack spacing={3}>
      {isSuccess && (
        <Alert severity="success">
          <AlertTitle>Registro efectuado con éxito</AlertTitle>
          Se ha registrado correctamente. Ahora puede acceder al panel de control.
        </Alert>
      )}

      {!isSuccess && error && (
        <Alert severity="error">
          <AlertTitle>Registro fallido</AlertTitle>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <AlignedGridItem item xs={6} isError={!isSuccess && error}>
          <TextField
            name="name"
            label="Nombre"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
          />
        </AlignedGridItem>
        <AlignedGridItem item xs={6} isError={!isSuccess && error}>
          <TextField
            name="lastName"
            label="Apellidos"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!lastNameError}
            helperText={lastNameError}
          />
        </AlignedGridItem>
      </Grid>

      <TextField
        name="email"
        label="Correo Electrónico"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleEmailBlur} // Invoke handleEmailBlur on blur event
        error={!!emailError}
        helperText={emailError}
      />

      <TextField
        name="phoneNumber"
        label="Número de Teléfono"
        fullWidth
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        error={!!phoneNumberError}
        helperText={phoneNumberError}
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

      <LoadingButton
        sx={{ my: 2 }}
        fullWidth
        size="large"
        variant="contained"
        onClick={handleSignUp}
        loading={isLoading} // Set the loading state of the button
      >
        Registrarse
      </LoadingButton>
    </Stack>
  );
}

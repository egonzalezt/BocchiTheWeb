import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, IconButton, InputAdornment, Stack, TextField, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import StandUsersApi from '../../services/standUsers'
import StandUsersBridgeApi from '../../services/standUsersBridge'
// Custom styled Grid item for adjusting alignment
const AlignedGridItem = styled(Grid)(({ theme, isError }) => ({
  display: 'flex',
  alignItems: isError ? 'flex-start' : 'center',
}));

export default function SignUpForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [isSuccess, setIsSuccess] = useState(false); // Add success state
  const [error, setError] = useState(null); // Add error state

  // State variables for form fields
  const [name, setName] = useState('');
  const [direction, setDirection] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');

  // Validation error states
  const [nameError, setNameError] = useState('');
  const [directionError, setDirectionError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [identificationNumberError, setIdentificationNumberError] = useState('');

  const handleEmailBlur = async () => {
    if (email.trim() !== '') {
      try {
        const { data } = await StandUsersApi.checkEmailExistence(email);
        if (data.exists) {
          setEmailError('El correo ingresado ya existe');
        } else {
          setEmailError('');
        }
      } catch (error) {
        console.error('Failed to check email existence:', error);
      }
    }
  };

  const handleIdentificationBlurBlur = async () => {
    if (identificationNumber.trim() !== '') {
      try {
        const { data } = await StandUsersApi.checkIdentificationNumberExistence(identificationNumber);
        if (data.exists) {
          setIdentificationNumberError('El documento de identidad ya esta en uso');
        } else {
          setIdentificationNumberError('');
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
    setIdentificationNumberError('');
    setDirectionError('')
    // Validate form fields
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Nombre es requerido');
      isValid = false;
    } else if (name.length > 100) {
      setNameError('Nombre no debe exceder los 100 caracteres');
      isValid = false;
    }

    if (direction.trim() === '') {
      setDirectionError('Direccion es requerido');
      isValid = false;
    } else if (direction.length < 5 || direction.length > 200) {
      setDirectionError('La direccion debe tener entre 5 y 200 caracteres');
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

    if (identificationNumber.trim() === '') {
      setIdentificationNumberError('El documento de identificacion es requerido');
      isValid = false;
    } else if (!/^\d{5,11}$/.test(identificationNumber)) {
      setIdentificationNumberError('El documento de identificacion debe tener entre 5 y 11 dígitos');
      isValid = false;
    }    

    if (isValid) {
      setIsLoading(true); // Set loading state to true

      try {
        const userDto = {
          name: `${name} ${lastName}`,
          email,
          identificationNumber,
          direction
        };

        await StandUsersBridgeApi.registerUser(userDto);
        setIsLoading(false); // Set loading state to false
        setIsSuccess(true); // Set success state to true
      } catch (error) {
        console.log(error)
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

  return (
    <Stack spacing={3}>
      {isSuccess && (
        <Alert severity="success">
          <AlertTitle>Registro efectuado con éxito</AlertTitle>
          En unos momentos recibira un correo electronico para continuar con el registro
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
        name="identificationNumber"
        label="Documento de identificacion"
        fullWidth
        value={identificationNumber}
        onChange={(e) => setIdentificationNumber(e.target.value)}
        onBlur={handleIdentificationBlurBlur}
        error={!!identificationNumberError}
        helperText={identificationNumberError}
      />

      <TextField
        name="direction"
        label="Direccion"
        fullWidth
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
        error={!!directionError}
        helperText={directionError}
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

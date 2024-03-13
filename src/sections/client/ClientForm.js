import { useState, useEffect } from 'react';
import { Stack, TextField, Checkbox, Grid, Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { LoadingButton } from '@mui/lab';
import ClientApi from '../../services/client';

export default function RegistrationForm({ id }) {
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [isSuccess, setIsSuccess] = useState(false); // Add success state
    const [error, setError] = useState(null); // Add error state

    const [nit, setNit] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [naturalPerson, setNaturalPerson] = useState(true);

    const [nitError, setNitError] = useState('');
    const [nameError, setNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isEmailTaken, setIsEmailTaken] = useState(false);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await ClientApi.getClientById(id);
                const { data } = response;
                setNit(data.nit || '');
                setName(data.name || '');
                setLastName(data.lastName || '');
                setEmail(data.email || '');
                setOriginalEmail(data.email || '');
                setNaturalPerson(data.naturalPerson || true);
            } catch (error) {
                console.error('Error fetching client:', error);
            }
        };

        if (id) {
            fetchClient();
        }
    }, [id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsSuccess(false);
        }, 10000); // 20 seconds

        return () => clearTimeout(timeout);
    }, [isSuccess]);

    const handleEmailBlur = async () => {
        if (email.trim() !== '' && originalEmail !== email) {
            try {
                const { data: emailExists } = await ClientApi.checkEmailExistence(email);

                if (emailExists) {
                    setEmailError('El correo ingresado ya existe');
                    setIsEmailTaken(true);
                } else {
                    setEmailError('');
                    setIsEmailTaken(false);
                }
            } catch (error) {
                console.error('Failed to check email existence:', error);
            }
        } else {
            setEmailError('');
            setIsEmailTaken(false);
        }
    };

    const handleSubmit = async () => {
        // Reset validation errors
        setNitError('');
        setNameError('');
        setLastNameError('');
        setEmailError('');

        // Validate form fields
        let isValid = true;

        // Perform validation and submit the form data

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

        if (isEmailTaken) {
            setEmailError('El correo ingresado ya existe');
            isValid = false;
        }
        else if (email.trim() === '') {
            setEmailError('Correo electrónico es requerido');
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError('Correo electrónico inválido');
            isValid = false;
        }

        if (!naturalPerson && nit.trim() === '') {
            setNitError('Nit es requerido');
            isValid = false;
        }

        if (isValid) {
            setIsLoading(true); // Set loading state to true

            try {
                // Create an object with the form data
                const formData = {
                    nit: naturalPerson ? nit : null,
                    name,
                    lastName,
                    email,
                    naturalPerson,
                };

                if (id) {
                    await ClientApi.updateClient(id, formData)
                } else {
                    await ClientApi.addClient(formData)
                }

                // Reset the form
                setIsLoading(false); // Set loading state to false
                setIsSuccess(true); // Set success state to true
            } catch (error) {
                setIsLoading(false); // Set loading state to false
                setIsSuccess(false); // Set success state to false
                setError(
                    error.response?.data?.message ||
                    'Fallo el registro, valide si posee algun error en los campos e intente nuevamente.'
                ); // Set error message from the response
                console.log(error)
            }
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box width="60%" sx={{ marginX: 'auto' }}>
                <Stack spacing={3}>
                    {isSuccess && (
                        <Alert severity="success">
                            <AlertTitle>
                                {id ? "Cliente editado con éxito" : "Registro efectuado con éxito"}
                            </AlertTitle>
                            {id ? "El cliente se ha editado de forma exitosa con los nuevos valores" :
                                "El cliente se a registrado de forma exitosa, ahora podra genera facturas o cotizaciones al cliente"
                            }
                        </Alert>
                    )}

                    {!isSuccess && error && (
                        <Alert severity="error">
                            <AlertTitle>Registro fallido</AlertTitle>
                            {error}
                        </Alert>
                    )}

                    <Grid container alignItems="center">
                        <Grid item xs={12}>
                            <Checkbox
                                name="naturalPerson"
                                checked={naturalPerson}
                                onChange={(e) => setNaturalPerson(e.target.checked)}
                            />
                            Persona Natural
                        </Grid>
                    </Grid>

                    <TextField
                        name="name"
                        label="Nombre"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={!!nameError}
                        helperText={nameError}
                    />
                    <TextField
                        name="lastName"
                        label="Apellidos"
                        fullWidth
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!lastNameError}
                        helperText={lastNameError}
                    />

                    <TextField
                        name="email"
                        label="Correo electrónico"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        error={!!emailError}
                        helperText={emailError}
                    />

                    {!naturalPerson && (
                        <TextField
                            name="nit"
                            label="NIT"
                            fullWidth
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            error={!!nitError}
                            helperText={nitError}
                        />
                    )}
                </Stack>
                <Box width="40%" sx={{ marginX: 'auto' }}>
                    <LoadingButton
                        sx={{ my: 2 }}
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        loading={isLoading} // Set the loading state of the button
                    >
                        {id ? 'Actualizar cliente' : 'Registrar cliente'}
                    </LoadingButton>
                </Box>
            </Box>
        </form>
    );
}
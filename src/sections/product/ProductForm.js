import { useState, useEffect } from 'react';
import { Stack, TextField, Checkbox, Grid, Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { LoadingButton } from '@mui/lab';

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ProductForm({ id }) {
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [isSuccess, setIsSuccess] = useState(false); // Add success state
    const [error, setError] = useState(null); // Add error state

    // Errors
    const [descriptionError, setDescriptionError] = useState('');

    // Form states
    const [paid, setPaid] = useState(false);
    const [quotation, setQuotation] = useState(false);
    const [enableDueDate, setEnableDueDate] = useState(false);
    const [description, setDescription] = useState('');
    const [enablePaymentInfo, setEnablePaymentInfo] = useState(false);

    const handleSubmit = async () => {
        console.log("yes")
    };

    const handleDateChange = async (date) => {
        console.log(date)
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

                    <Grid container alignItems="center" direction="col">
                        <Grid item xs={12}>
                            <Checkbox
                                name="paid"
                                checked={paid}
                                onChange={(e) => setPaid(e.target.checked)}
                            />
                            Pagado
                        </Grid>
                        <Grid item xs={12}>
                            <Checkbox
                                name="quotation"
                                checked={quotation}
                                onChange={(e) => setQuotation(e.target.checked)}
                            />
                            Cotizacion
                        </Grid>
                        <Grid item xs={12}>
                            <Checkbox
                                name="enablePaymentInfo"
                                checked={enablePaymentInfo}
                                onChange={(e) => setEnablePaymentInfo(e.target.checked)}
                            />
                            Habilitar informacion bancaria en la factura
                        </Grid>
                    </Grid>

                    <TextField
                        name="description"
                        label="Descripcion"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!descriptionError}
                        helperText={descriptionError}
                    />

                    <Grid container alignItems="center" direction="col">
                        <Grid item xs={12}>
                            <Checkbox
                                name="enableDueDate"
                                checked={enableDueDate}
                                onChange={(e) => setEnableDueDate(e.target.checked)}
                            />
                            Establecer fecha maxima de pago
                        </Grid>
                    </Grid>

                    {enableDueDate &&

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer
                                components={[
                                    'DesktopDatePicker',
                                ]}
                            >
                                <DemoItem label="Desktop variant">
                                    <DesktopDatePicker onChange={handleDateChange} />
                                </DemoItem>
                            </DemoContainer>
                        </LocalizationProvider>
                    }

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
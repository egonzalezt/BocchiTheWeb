import React, { useState, useEffect } from 'react';
import { Stack, Typography, Box, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { enqueueSnackbar } from 'notistack';
import bebopTransfer from '../../services/bebopTransfer';

export default function TransferUserForm() {
    const [operators, setOperators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        documentType: '',
        documentTypeError: '',
        isLoading: false,
    });

    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const response = await bebopTransfer.getOperators();
                setOperators(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching operators:', error);
                setIsLoading(false);
                enqueueSnackbar('Error fetching operators. Please try again later.', { variant: 'error' });
            }
        };

        fetchOperators();
    }, []);

    const handleDocumentTypeChange = (event) => {
        setFormData({
            ...formData,
            documentType: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const confirmed = window.confirm('¿Estás seguro de realizar la transferencia?');
        if (confirmed) {
            const selectedOperator = operators.find(operator => operator.operatorName === formData.documentType);
            if (selectedOperator) {
                const data = {
                    operatorId: selectedOperator._id
                };
                try {
                    const response = await bebopTransfer.transfer(data);
                    enqueueSnackbar('Transferencia realizada correctamente, en breve recibirá un correo electrónico.', { variant: 'success' });
                } catch (error) {
                    console.error('Error al realizar la transferencia:', error);
                    enqueueSnackbar('Error al realizar la transferencia. Por favor, inténtalo de nuevo más tarde.', { variant: 'error' });
                }
            } else {
                console.error('Operador seleccionado no encontrado:', formData.documentType);
                enqueueSnackbar('Error al encontrar el operador seleccionado. Por favor, selecciona un operador válido.', { variant: 'error' });
            }
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            {isLoading ? (
                <Box width="60%" sx={{ marginX: 'auto' }}>
                    <LoadingButton fullWidth size="large" variant="contained" loading>
                        Loading...
                    </LoadingButton>
                </Box>
            ) : (
                <Box width="60%" sx={{ marginX: 'auto' }}>
                    <Stack spacing={3}>
                        <Typography variant="subtitle1">Operadores disponibles</Typography>
                        <Select
                            value={formData.documentType}
                            onChange={handleDocumentTypeChange}
                            label="Operador"
                            error={!!formData.documentTypeError}
                            helperText={formData.documentTypeError}
                            fullWidth
                        >
                            <MenuItem value="">Seleccionar</MenuItem>
                            {Array.isArray(operators) && operators.map((operator) => (
                                <MenuItem key={operator._id} value={operator.operatorName}>
                                    {operator.operatorName}
                                </MenuItem>
                            ))}
                        </Select>
                    </Stack>
                    <Box width="40%" sx={{ marginX: 'auto' }}>
                        <LoadingButton
                            sx={{ my: 2 }}
                            fullWidth
                            size="large"
                            variant="contained"
                            type="submit" // Cambiado a "submit" para que se active el onSubmit
                            loading={formData.isLoading}
                        >
                            Realizar Transferencia
                        </LoadingButton>
                    </Box>
                </Box>
            )}
        </form>
    );
}

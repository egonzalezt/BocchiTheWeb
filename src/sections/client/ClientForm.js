import { useState, useEffect } from 'react';
import { Stack, TextField, Typography, Box, Select, MenuItem } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { LoadingButton } from '@mui/lab';
import { v4 as uuidv4 } from 'uuid';
import coplandFileManager from '../../services/coplandFileManager';

const initialState = {
    name: '',
    nameError: '',
    documentTypeError: '',
    fileSelectedError: '',
    documentType: '',
    file: null,
    fileBinary: null,
    fileInfo: {
        name: "",
        nameWithExtension: "",
        mimeType: "",
        category: 0
    },
    isLoading: false,
    isSuccess: false,
    error: null
};

export default function RegistrationForm({ id }) {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFormData((prevData) => ({
                ...prevData,
                isSuccess: false,
                error: null
            }));
        }, 10000);

        return () => clearTimeout(timeout);
    }, [formData.isSuccess]);

    const handleSubmit = async () => {
        const { name, documentType, file, fileInfo } = formData;
        let isValid = true;
        let nameError = '';
        let documentTypeError = '';
        let fileSelectedError = '';

        if (name.trim() === '') {
            nameError = 'Nombre es requerido';
            isValid = false;
        } else if (name.length > 50) {
            nameError = 'Nombre no debe exceder los 50 caracteres';
            isValid = false;
        }

        if (documentType.trim() === '') {
            documentTypeError = 'Debe seleccionar una categoría';
            isValid = false;
        }

        if (!file) {
            fileSelectedError = 'Debe seleccionar un archivo';
            isValid = false;
        }

        if (isValid) {
            setFormData((prevData) => ({
                ...prevData,
                isLoading: true
            }));

            try {
                const categoryValue = mapCategoryValue(documentType);
                const dataToSend = {
                    name,
                    nameWithExtension: fileInfo.nameWithExtension,
                    mimeType: fileInfo.mimeType,
                    category: categoryValue
                };
                const signedUrlResponse = await coplandFileManager.uploadFileSignedUrl(dataToSend);
                await coplandFileManager.uploadFile(signedUrlResponse.content.url, fileInfo.mimeType, formData.file);
                setFormData(initialState);
            } catch (error) {
                setFormData((prevData) => ({
                    ...prevData,
                    isLoading: false,
                    isSuccess: false,
                    error: 'Ocurrió un error al realizar la operación. Por favor, inténtalo de nuevo más tarde.'
                }));
                console.log(error);
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                nameError,
                documentTypeError,
                fileSelectedError
            }));
        }
    };

    const mapCategoryValue = (categoryName) => {
        switch (categoryName) {
            case 'Identity':
                return 0;
            case 'Health':
                return 1;
            case 'Study':
                return 2;
            case 'Living':
                return 3;
            case 'Default':
                return 4;
            default:
                return 0;
        }
    };

    const handleDocumentTypeChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            documentType: e.target.value,
            documentTypeError: ''
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = () => {
                const fileInfo = {
                    name: selectedFile.name,
                    nameWithExtension: `${uuidv4()}.${selectedFile.name.split('.').pop()}`,
                    mimeType: selectedFile.type,
                    category: 0
                };
                setFormData((prevData) => ({
                    ...prevData,
                    file: selectedFile,
                    fileSelectedError: '',
                    fileInfo,
                    fileBinary: fileReader.result
                }));
            };
        } else {
            setFormData((prevData) => ({
                ...prevData,
                file: null,
                fileSelectedError: 'Debe seleccionar un archivo'
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box width="60%" sx={{ marginX: 'auto' }}>
                <Stack spacing={3}>
                    {formData.isSuccess && (
                        <Alert severity="success">
                            <AlertTitle>
                                {id ? "Archivo editado con éxito" : "Registro efectuado con éxito"}
                            </AlertTitle>
                            {id ? "El Archivo se ha editado de forma exitosa con los nuevos valores" :
                                "El Archivo se a registrado de forma exitosa"
                            }
                        </Alert>
                    )}

                    {!formData.isSuccess && formData.error && (
                        <Alert severity="error">
                            <AlertTitle>Error</AlertTitle>
                            {formData.error}
                        </Alert>
                    )}

                    <TextField
                        name="name"
                        label="Nombre"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData((prevData) => ({ ...prevData, name: e.target.value, nameError: '' }))}
                        error={!!formData.nameError}
                        helperText={formData.nameError}
                    />

                    <Typography variant="subtitle1">Tipo de Documento</Typography>
                    <Select
                        value={formData.documentType}
                        onChange={handleDocumentTypeChange}
                        label="Tipo de Documento"
                        error={!!formData.documentTypeError}
                        helperText={formData.documentTypeError}
                        fullWidth
                    >
                        <MenuItem value="">Seleccionar</MenuItem>
                        <MenuItem value="Identity">Identidad</MenuItem>
                        <MenuItem value="Health">Salud</MenuItem>
                        <MenuItem value="Study">Estudio</MenuItem>
                        <MenuItem value="Living">Vivienda</MenuItem>
                        <MenuItem value="Default">Por defecto</MenuItem>
                    </Select>

                    {formData.documentTypeError && (
                        <Box sx={{ color: 'red' }}>
                            <Typography variant="subtitle2">{formData.documentTypeError}</Typography>
                        </Box>
                    )}

                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                    {formData.fileSelectedError && (
                        <Box sx={{ color: 'red' }}>
                            <Typography variant="subtitle2">{formData.fileSelectedError}</Typography>
                        </Box>
                    )}
                </Stack>
                <Box width="40%" sx={{ marginX: 'auto' }}>
                    <LoadingButton
                        sx={{ my: 2 }}
                        fullWidth
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        loading={formData.isLoading}
                    >
                        {id ? 'Actualizar archivo' : 'Registrar archivo'}
                    </LoadingButton>
                </Box>
            </Box>
        </form>
    );
}

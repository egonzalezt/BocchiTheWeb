import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import Axios from 'axios'; // Import Axios
import CoplandFileManager from '../services/coplandFileManager';

export default function DocumentViewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [documentUrl, setDocumentUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const fileId = new URLSearchParams(location.search).get('id');
    const [errorCount, setErrorCount] = useState(0); // Contador de errores

    useEffect(() => {
        const fetchDocumentUrl = async () => {
            try {
                if (!fileId || !isValidUuid(fileId)) {
                    enqueueSnackbar('El identificador de archivo no es válido', { variant: 'error' });
                    navigate('/dashboard/files/');
                    return;
                }
                const fileUrl = await CoplandFileManager.getFileUrl(fileId);
                await Axios.get(fileUrl.url);
                setDocumentUrl(fileUrl.url);
            } catch (error) {
                let message = "Ocurrio un error al obtener el archivo"
                if (error.response.status === 404) {
                    message = 'El archivo solicitado no existe';
                }
                if (error.response.status === 400) {
                    message = 'Se ha producido un error al obtener el archivo';
                }
                enqueueSnackbar(message, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        if (fileId) {
            fetchDocumentUrl();
        } else {
            enqueueSnackbar('No se ha especificado un identificador de archivo', { variant: 'error' });
            navigate('/dashboard/files/');
        }
    }, [fileId, documentUrl, navigate, errorCount]); // Agregar errorCount a las dependencias

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            {loading ? (
                <CircularProgress />
            ) : documentUrl ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                        <iframe src={documentUrl} title="Documento" style={{ width: '100%', height: '100%', border: 'none' }} />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                    <img src="/assets/illustrations/fileNotFound.png" alt="Archivo no encontrado" style={{ maxWidth: '50%', marginTop: '20px' }} />
                    <div>Archivo no encontrado. Por favor, contáctanos para resolver el problema.</div>
                </div>
            )}
        </div>
    );    
}

function isValidUuid(uuid) {
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(uuid);
}

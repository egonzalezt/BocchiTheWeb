import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack'; // Import enqueueSnackbar
import { CircularProgress } from '@mui/material'; // Import CircularProgress
import CoplandFileManager from '../services/coplandFileManager';

export default function DocumentViewPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [documentUrl, setDocumentUrl] = useState('');
    const [loading, setLoading] = useState(true); // State para el loading
    const fileId = new URLSearchParams(location.search).get('id');

    useEffect(() => {
        const fetchDocumentUrl = async () => {
            try {
                if (!fileId || !isValidUuid(fileId)) {
                    enqueueSnackbar('El identificador de archivo no es válido', { variant: 'error' });
                    navigate('/dashboard/files/');
                    return;
                }
                console.log(fileId);
                const fileUrl = await CoplandFileManager.getFileUrl(fileId);
                setDocumentUrl(fileUrl.url);
            } catch (error) {
                console.error('Error fetching document URL:', error);
            } finally {
                setLoading(false); // Cuando se complete la carga, se establece loading en false
            }
        };

        if (fileId) {
            fetchDocumentUrl();
        } else { // Si no hay fileId en el query, redirige al usuario a la página de archivos
            enqueueSnackbar('No se ha especificado un identificador de archivo', { variant: 'error' });
            navigate('/dashboard/files/');
        }
    }, [fileId, navigate]);

    return (
        <div>
            {loading ? ( // Si está cargando, mostrar CircularProgress
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>
            ) : documentUrl ? (
                <iframe src={documentUrl} title="Documento" style={{ width: '100%', height: '100vh', border: 'none' }} />
            ) : (
                <div>Cargando...</div>
            )}
        </div>
    );
}

// Función para verificar si es un UUID válido
function isValidUuid(uuid) {
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(uuid);
}

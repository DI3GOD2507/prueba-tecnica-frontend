import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Alert,
    useTheme
} from '@mui/material';

// Asegúrate de NO importar './UserFormModal.css' aquí

function UserFormModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    departments,
    positions,
    apiError
}) {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        usuario: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        departamentoId: '',
        cargoId: '',
    });

    const isEditMode = Boolean(initialData);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && initialData) {
                setFormData({
                    usuario: initialData.usuario || '',
                    primerNombre: initialData.primerNombre || '',
                    segundoNombre: initialData.segundoNombre || '',
                    primerApellido: initialData.primerApellido || '',
                    segundoApellido: initialData.segundoApellido || '',
                    departamentoId: initialData.departamento?.id || '',
                    cargoId: initialData.cargo?.id || '',
                });
            } else {
                setFormData({
                    usuario: '', primerNombre: '', segundoNombre: '',
                    primerApellido: '', segundoApellido: '',
                    departamentoId: '', cargoId: ''
                });
            }
        }
    }, [initialData, isEditMode, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const fieldWrapperSx = {
        padding: theme.spacing(1),
        boxSizing: 'border-box',
    };

    const fourColumnsSx = {
        ...fieldWrapperSx,
        width: '25%', // Fijo 4 columnas
    };

    const threeColumnsSx = {
        ...fieldWrapperSx,
        width: '33.333%', // Fijo 3 columnas
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            PaperProps={{ // <- Aquí se define el tamaño fijo del modal
                sx: {
                    width: '900px', // AJUSTA ESTE ANCHO COMO NECESITES
                    maxWidth: 'none',
                }
            }}
        >
            <DialogTitle>{isEditMode ? 'Editar usuario' : 'Registrar usuario'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent
                    dividers
                    sx={{ // <- Aquí se define el layout interno con Flexbox
                        display: 'flex',
                        flexWrap: 'wrap',
                        margin: theme.spacing(-1),
                        padding: theme.spacing(1),
                    }}
                >
                    {apiError && (
                        <Box sx={{ width: '100%', padding: theme.spacing(1) }}>
                             <Alert severity="error" sx={{ mb: 1 }}>{apiError}</Alert>
                        </Box>
                    )}

                    {/* --- Fila 1: 4 Campos --- */}
                    <Box sx={fourColumnsSx}>
                        <FormControl fullWidth required variant="outlined" margin="dense">
                            <InputLabel id="modal-dept-label">Departamento</InputLabel>
                            <Select
                                labelId="modal-dept-label"
                                name="departamentoId"
                                value={formData.departamentoId}
                                onChange={handleChange}
                                label="Departamento"
                            >
                                <MenuItem value="" disabled><em>Seleccione...</em></MenuItem>
                                {departments.map(dept => (
                                    <MenuItem key={dept.id} value={dept.id}>{dept.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={fourColumnsSx}>
                        <FormControl fullWidth required variant="outlined" margin="dense">
                            <InputLabel id="modal-pos-label">Cargo</InputLabel>
                            <Select
                                labelId="modal-pos-label"
                                name="cargoId"
                                value={formData.cargoId}
                                onChange={handleChange}
                                label="Cargo"
                            >
                                <MenuItem value="" disabled><em>Seleccione...</em></MenuItem>
                                {positions.map(pos => (
                                    <MenuItem key={pos.id} value={pos.id}>{pos.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={fourColumnsSx}>
                        <TextField
                            margin="dense" name="usuario" label="Usuario"
                            fullWidth variant="outlined" value={formData.usuario}
                            onChange={handleChange} required disabled={isEditMode}
                        />
                    </Box>
                    <Box sx={fourColumnsSx}>
                        <TextField
                            margin="dense" name="primerNombre" label="Primer Nombre"
                            fullWidth variant="outlined" value={formData.primerNombre}
                            onChange={handleChange} required
                        />
                    </Box>

                    {/* --- Fila 2: 3 Campos --- */}
                    <Box sx={threeColumnsSx}>
                        <TextField
                            margin="dense" name="segundoNombre" label="Segundo Nombre"
                            fullWidth variant="outlined" value={formData.segundoNombre}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box sx={threeColumnsSx}>
                        <TextField
                            margin="dense" name="primerApellido" label="Primer Apellido"
                            fullWidth variant="outlined" value={formData.primerApellido}
                            onChange={handleChange} required
                        />
                    </Box>
                    <Box sx={threeColumnsSx}>
                        <TextField
                            margin="dense" name="segundoApellido" label="Segundo Apellido"
                            fullWidth variant="outlined" value={formData.segundoApellido}
                            onChange={handleChange}
                        />
                    </Box>

                </DialogContent>

                <DialogActions sx={{ padding: '16px 24px' }}>
                    <Button onClick={onClose} color="inherit" variant="text">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {isEditMode ? 'Actualizar' : 'Registrar'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default UserFormModal;
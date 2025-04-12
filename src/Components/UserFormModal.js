// src/components/UserFormModal.js
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
    Grid, // Para layout del formulario
    Box,
    Alert // Para mostrar errores de API dentro del modal
} from '@mui/material';

function UserFormModal({
    isOpen,
    onClose,
    onSave,
    initialData, // UserDto completo o null
    departments, // Departamentos activos
    positions,   // Cargos activos
    apiError     // Error de API pasado desde App.js
}) {
    // Estado local para los campos del formulario
    // Inicializamos con valores por defecto para evitar errores de "uncontrolled to controlled"
    const [formData, setFormData] = useState({
        usuario: '',
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        departamentoId: '', // Almacenamos el ID seleccionado
        cargoId: '',       // Almacenamos el ID seleccionado
    });

    // Determina si estamos en modo edición
    const isEditMode = Boolean(initialData);

    // Cuando initialData cambia (al abrir para editar), o al abrir para crear, actualiza el estado del formulario
    useEffect(() => {
        if (isOpen) { // Solo actualiza si el modal está abierto
            if (isEditMode && initialData) {
                setFormData({
                    usuario: initialData.usuario || '',
                    primerNombre: initialData.primerNombre || '',
                    segundoNombre: initialData.segundoNombre || '',
                    primerApellido: initialData.primerApellido || '',
                    segundoApellido: initialData.segundoApellido || '',
                    // Extrae los IDs de los objetos anidados
                    departamentoId: initialData.departamento?.id || '',
                    cargoId: initialData.cargo?.id || '',
                });
            } else {
                // Resetea el formulario si es para crear uno nuevo
                setFormData({
                    usuario: '', primerNombre: '', segundoNombre: '',
                    primerApellido: '', segundoApellido: '',
                    departamentoId: '', cargoId: ''
                });
            }
        }
    }, [initialData, isEditMode, isOpen]); // Dependencia: initialData e isOpen

    if (!isOpen) {
        return null; // No renderiza nada si el modal no está abierto
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el envío tradicional del formulario
        // Aquí podrías añadir validaciones visuales de MUI si quieres
        onSave(formData); // Llama a la función de guardado pasada desde App.js
                          // App.js se encargará de construir el payload completo con objetos
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth> {/* sm = small, fullWidth ocupa el ancho */}
            <DialogTitle>{isEditMode ? 'Editar usuario' : 'Registrar usuario'}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}> {/* Usamos Box como form */}
                <DialogContent dividers> {/* dividers añade líneas separadoras */}
                    {/* Mostramos el error de la API aquí si existe */}
                     {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

                     {/* Usamos Grid para organizar los campos */}
                    <Grid container spacing={2}> {/* spacing={2} -> 16px de espacio */}

                        {/* Fila 1: Departamento y Cargo */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="modal-department-label">Departamento</InputLabel>
                                <Select
                                    labelId="modal-department-label"
                                    id="modal-department"
                                    name="departamentoId" // Coincide con el estado
                                    value={formData.departamentoId}
                                    label="Departamento"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Seleccione...</em>
                                    </MenuItem>
                                    {departments.map(dept => (
                                        <MenuItem key={dept.id} value={dept.id}>{dept.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel id="modal-position-label">Cargo</InputLabel>
                                <Select
                                    labelId="modal-position-label"
                                    id="modal-position"
                                    name="cargoId" // Coincide con el estado
                                    value={formData.cargoId}
                                    label="Cargo"
                                    onChange={handleChange}
                                >
                                     <MenuItem value="" disabled>
                                        <em>Seleccione...</em>
                                    </MenuItem>
                                    {positions.map(pos => (
                                        <MenuItem key={pos.id} value={pos.id}>{pos.nombre}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Fila 2: Usuario */}
                        {/* ELIMINAMOS EL CAMPO EMAIL */}
                        <Grid item xs={12} sm={6}> {/* O xs={12} si quieres que ocupe toda la fila */}
                             <TextField
                                margin="dense" // Menos margen vertical
                                id="usuario"
                                name="usuario"
                                label="Usuario"
                                type="text"
                                fullWidth
                                variant="outlined" // Estilo estándar
                                value={formData.usuario}
                                onChange={handleChange}
                                required
                                disabled={isEditMode} // Deshabilitado en modo edición
                            />
                        </Grid>
                         <Grid item xs={12} sm={6}>
                            {/* Espacio vacío o puedes poner otro campo aquí si surge */}
                         </Grid>


                         {/* Fila 3: Nombres */}
                         <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                id="primerNombre"
                                name="primerNombre"
                                label="Primer Nombre"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.primerNombre}
                                onChange={handleChange}
                                required
                            />
                         </Grid>
                         <Grid item xs={12} sm={6}>
                            <TextField
                                margin="dense"
                                id="segundoNombre"
                                name="segundoNombre"
                                label="Segundo Nombre"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.segundoNombre}
                                onChange={handleChange}
                                // No requerido usualmente
                            />
                         </Grid>

                         {/* Fila 4: Apellidos */}
                         <Grid item xs={12} sm={6}>
                             <TextField
                                margin="dense"
                                id="primerApellido"
                                name="primerApellido"
                                label="Primer Apellido"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.primerApellido}
                                onChange={handleChange}
                                required
                            />
                         </Grid>
                          <Grid item xs={12} sm={6}>
                             <TextField
                                margin="dense"
                                id="segundoApellido"
                                name="segundoApellido"
                                label="Segundo Apellido"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={formData.segundoApellido}
                                onChange={handleChange}
                                // No requerido usualmente
                            />
                         </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary"> {/* secondary suele ser gris */}
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
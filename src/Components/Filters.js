// src/components/Filters.js
import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Filters({
    departments, // Ya vienen filtrados por activos desde App.js
    positions,   // Ya vienen filtrados por activos desde App.js
    selectedDepartment,
    selectedPosition,
    onDepartmentChange,
    onPositionChange,
    onCreateNew
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap', // Para responsividad
                gap: 2, // Espacio entre elementos
                mb: 3, // Margen inferior
                p: 2, // Padding
                // backgroundColor: 'background.paper', // Fondo opcional
                // borderRadius: 1 // Bordes redondeados opcionales
            }}
        >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {/* Select de Departamento */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="department-select-label">Departamento</InputLabel>
                    <Select
                        labelId="department-select-label"
                        id="department-select"
                        value={selectedDepartment}
                        label="Departamento"
                        onChange={(e) => onDepartmentChange(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Seleccione un Departamento</em>
                        </MenuItem>
                        {departments.map((dept) => (
                            // Usamos el ID (Guid) como value
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Select de Cargo */}
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="position-select-label">Cargo</InputLabel>
                    <Select
                        labelId="position-select-label"
                        id="position-select"
                        value={selectedPosition}
                        label="Cargo"
                        onChange={(e) => onPositionChange(e.target.value)}
                    >
                        <MenuItem value="">
                            <em>Seleccione un Cargo</em>
                        </MenuItem>
                        {positions.map((pos) => (
                             // Usamos el ID (Guid) como value
                            <MenuItem key={pos.id} value={pos.id}>
                                {pos.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Botón Crear */}
            <Button
                variant="contained"
                color="primary" // O "success" si prefieres verde
                startIcon={<AddIcon />}
                onClick={onCreateNew}
            >
                Crear nuevo usuario
            </Button>
        </Box>
    );
}

export default Filters;
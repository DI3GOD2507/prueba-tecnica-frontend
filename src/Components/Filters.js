import React from 'react';
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Filters({
    departments,
    positions,
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
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
            }}
        >
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        id="department-select"
                        value={selectedDepartment}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Seleccione un Departamento' }}
                    >
                        <MenuItem value="" disabled>
                            <em>Seleccione un Departamento</em>
                        </MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <Select
                        id="position-select"
                        value={selectedPosition}
                        onChange={(e) => onPositionChange(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Seleccione un Cargo' }}
                    >
                        <MenuItem value="" disabled>
                             <em>Seleccione un Cargo</em>
                        </MenuItem>
                        {positions.map((pos) => (
                            <MenuItem key={pos.id} value={pos.id}>
                                {pos.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={onCreateNew}
            >
                Crear nuevo usuario
            </Button>
        </Box>
    );
}

export default Filters;
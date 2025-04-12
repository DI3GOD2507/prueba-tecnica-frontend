// src/components/UserTableRow.js
import React from 'react';
import { TableCell, TableRow, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserTableRow({ user, onEdit, onDelete }) {
    // Extraemos los datos del UserDto (incluyendo objetos anidados)
    const {
        id, // Guid ID
        usuario,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        departamento, // Objeto DepartamentoDto
        cargo         // Objeto CargoDto
    } = user;

    const nombreCompleto = `${primerNombre || ''} ${segundoNombre || ''}`.trim();
    const apellidosCompletos = `${primerApellido || ''} ${segundoApellido || ''}`.trim();
    const departamentoNombre = departamento?.nombre || 'N/A'; // Accede al nombre anidado
    const cargoNombre = cargo?.nombre || 'N/A';           // Accede al nombre anidado

    return (
        <TableRow
            hover // Efecto hover para indicar que es clickeable (opcional)
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }} // Quita borde inferior de la última fila
        >
            <TableCell component="th" scope="row">
                {usuario}
            </TableCell>
            <TableCell>{nombreCompleto}</TableCell>
            <TableCell>{apellidosCompletos}</TableCell>
            <TableCell>{departamentoNombre}</TableCell>
            <TableCell>{cargoNombre}</TableCell>
            {/* ELIMINAMOS LA CELDA EMAIL */}
            <TableCell align="right">
                 {/* Usamos Box para agrupar botones si es necesario */}
                 <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => onEdit(user)} // Pasamos el UserDto completo a editar
                        color="warning" // Color amarillo para editar
                    >
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => onDelete(id)} // Pasamos el Guid ID a eliminar
                        color="error" // Color rojo para eliminar
                    >
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                 </Box>
            </TableCell>
        </TableRow>
    );
}

export default UserTableRow;
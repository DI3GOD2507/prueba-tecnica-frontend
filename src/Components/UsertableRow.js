import React from 'react';
import {
    TableCell,
    TableRow,
    Button,
    Box,
    Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function UserTableRow({ user, onEdit, onDelete, isOddRow, theme }) {
    const {
        id,
        usuario,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        departamento,
        cargo
    } = user;

    const nombreCompleto = `${primerNombre || ''} ${segundoNombre || ''}`.trim();
    const apellidosCompletos = `${primerApellido || ''} ${segundoApellido || ''}`.trim();
    const departamentoNombre = departamento?.nombre || 'N/A';
    const cargoNombre = cargo?.nombre || 'N/A';

    return (
        <TableRow
            hover
            sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                ...(isOddRow && { backgroundColor: theme.palette.action.hover }),
                '& td, & th': { borderBottom: `1px solid ${theme.palette.divider}` }
            }}
        >
            <TableCell component="th" scope="row">{usuario}</TableCell>
            <TableCell>{nombreCompleto}</TableCell>
            <TableCell>{apellidosCompletos}</TableCell>
            <TableCell>{departamentoNombre}</TableCell>
            <TableCell>{cargoNombre}</TableCell>
            <TableCell align="right">
                 <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                        variant="text"
                        color="success"
                        size="small"
                        startIcon={<EditIcon fontSize="inherit" />}
                        onClick={() => onEdit(user)}
                    >
                        Editar
                    </Button>
                     <Button
                        variant="text"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon fontSize="inherit" />}
                        onClick={() => onDelete(id)}
                     >
                        Eliminar
                     </Button>
                 </Stack>
            </TableCell>
        </TableRow>
    );
}

export default UserTableRow;
// src/components/UserTable.js
import React from 'react';
import UserTableRow from './UsertableRow';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, // Para darle un fondo y sombra
    Typography
} from '@mui/material';

function UserTable({ users, onEdit, onDelete }) {
    if (!users || users.length === 0) {
        return <Typography sx={{ textAlign: 'center', my: 3 }}>No hay usuarios para mostrar.</Typography>;
    }

    return (
        <TableContainer component={Paper}> {/* Envuelve la tabla en Paper */}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {/* Definimos las cabeceras */}
                        <TableCell>Usuario</TableCell>
                        <TableCell>Nombres</TableCell>
                        <TableCell>Apellidos</TableCell>
                        <TableCell>Departamento</TableCell>
                        <TableCell>Cargo</TableCell>
                        {/* ELIMINAMOS LA COLUMNA EMAIL */}
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        // Usamos el ID (Guid) como key
                        <UserTableRow
                            key={user.id}
                            user={user} // Pasamos el UserDto completo
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default UserTable;
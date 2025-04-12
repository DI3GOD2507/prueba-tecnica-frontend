import React from 'react';
import UserTableRow from './UsertableRow'; 
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    useTheme
} from '@mui/material';
import { grey } from '@mui/material/colors';

function UserTable({ users, onEdit, onDelete }) {
    const theme = useTheme();

    if (!users || users.length === 0) {
        return <Typography sx={{ textAlign: 'center', my: 3 }}>No hay usuarios para mostrar.</Typography>;
    }

    return (
        <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table sx={{ minWidth: 650 }} aria-label="tabla usuarios">
                <TableHead>
                    <TableRow sx={{ '& th': { backgroundColor: grey[100], fontWeight: 'bold' } }}>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Nombres</TableCell>
                        <TableCell>Apellidos</TableCell>
                        <TableCell>Departamento</TableCell>
                        <TableCell>Cargo</TableCell>
                        <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user, index) => (
                        <UserTableRow
                            key={user.id}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isOddRow={index % 2 !== 0}
                            theme={theme}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default UserTable;
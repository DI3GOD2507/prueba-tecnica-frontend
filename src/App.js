import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from './services/api';
import UserTable from './Components/UserTable';
import Filters from './Components/Filters';
import UserFormModal from './Components/UserFormModal';

import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Paper
} from '@mui/material';

const theme = createTheme();

function App() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const activeDepartments = useMemo(() => departments.filter(d => d.activo), [departments]);
    const activePositions = useMemo(() => positions.filter(p => p.activo), [positions]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const deptMatch = !selectedDepartment || user.departamento?.id === selectedDepartment;
            const posMatch = !selectedPosition || user.cargo?.id === selectedPosition;
            return deptMatch && posMatch;
        });
    }, [users, selectedDepartment, selectedPosition]);

    const fetchUsers = useCallback(async () => {
        console.log("fetchUsers: Iniciando carga de usuarios...");
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getUsers();
            console.log("fetchUsers: Datos recibidos:", response.data);
            setUsers(response.data || []);
        } catch (err) {
            console.error("fetchUsers: Error fetching users:", err);
            setError("No se pudieron cargar los usuarios.");
            setUsers([]);
        } finally {
            setIsLoading(false);
            console.log("fetchUsers: Carga finalizada.");
        }
    }, []);

    const fetchMetadata = useCallback(async () => {
        try {
            const [deptResponse, posResponse] = await Promise.all([
                api.getDepartments(),
                api.getPositions()
            ]);
            setDepartments(deptResponse.data || []);
            setPositions(posResponse.data || []);
        } catch (err) {
            console.error("Error fetching metadata:", err);
            setError("No se pudieron cargar departamentos o cargos.");
        }
    }, []);

    useEffect(() => {
        fetchMetadata();
        fetchUsers();
    }, [fetchMetadata, fetchUsers]); // Añadir dependencias correctas

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            setError(null);
            setIsLoading(true);
            try {
                await api.deleteUser(userId);
                console.log("Usuario eliminado, recargando...");
                await fetchUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                setError("Error al eliminar el usuario.");
            } finally {
                 setIsLoading(false);
            }
        }
    };

    const handleCreateNew = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

     const handleModalSave = async (userDataFromForm) => {
        setError(null);
        console.log("Datos recibidos del modal:", userDataFromForm);

        const payload = {
           usuario: userDataFromForm.usuario,
           primerNombre: userDataFromForm.primerNombre,
           segundoNombre: userDataFromForm.segundoNombre,
           primerApellido: userDataFromForm.primerApellido,
           segundoApellido: userDataFromForm.segundoApellido,
           IdDepartamento: userDataFromForm.departamentoId,
           IdCargo: userDataFromForm.cargoId
        };
        console.log("Payload FINAL enviado a la API:", payload);

        let operationSuccess = false;

        try {
             setIsLoading(true);
             console.log(editingUser ? "Intentando actualizar usuario..." : "Intentando crear usuario...");

             if (editingUser) {
                  payload.Id = editingUser.id;
                  await api.updateUser(editingUser.id, payload);
                  console.log("Usuario actualizado exitosamente en API.");
             } else {
                  await api.createUser(payload);
                  console.log("Usuario creado exitosamente en API.");
             }

             operationSuccess = true;

             setIsModalOpen(false);
             setEditingUser(null);
             console.log("Operación exitosa, procediendo a recargar usuarios...");
             await fetchUsers();
             console.log("Llamada a fetchUsers completada.");

        } catch (err) {
            console.error("Error saving user:", err);
            if (err.response) {
                console.error("Error data:", err.response.data);
                console.error("Error status:", err.response.status);
                 const errorMsg = err.response.data?.Message || err.response.data || "Error al guardar el usuario.";
                 setError(errorMsg);
            } else {
                 setError("Error al guardar el usuario. Verifique la conexión.");
            }
        } finally {
            setIsLoading(false);
            console.log("Operación de guardado finalizada (finally). Éxito:", operationSuccess);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Módulo de Administración
                </Typography>
                <Typography variant="h4" component="h1" gutterBottom>
                    Administración de usuarios
                </Typography>

                 <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
                    <Filters
                        departments={activeDepartments}
                        positions={activePositions}
                        selectedDepartment={selectedDepartment}
                        selectedPosition={selectedPosition}
                        onDepartmentChange={setSelectedDepartment}
                        onPositionChange={setSelectedPosition}
                        onCreateNew={handleCreateNew}
                    />

                    <Box sx={{ mt: 3 }}>
                        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
                        {error && !isLoading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        {!isLoading && !error && (
                            <UserTable
                                users={filteredUsers}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        )}
                        {!isLoading && <Typography sx={{ mt: 2 }}>Total Registros: {filteredUsers.length}</Typography>}
                    </Box>
                 </Paper>

                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                    initialData={editingUser}
                    departments={activeDepartments}
                    positions={activePositions}
                    apiError={error}
                />
            </Container>
        </ThemeProvider>
    );
}

export default App;
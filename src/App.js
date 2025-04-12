// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as api from './services/api';
import UserTable from './Components/UserTable';
import Filters from './Components/Filters';
import UserFormModal from './Components/UserFormModal';

// Importaciones de Material UI
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    CssBaseline,
    ThemeProvider, // Opcional: para tema personalizado
    createTheme   // Opcional: para tema personalizado
} from '@mui/material';

// Tema básico (opcional, puedes personalizarlo)
const theme = createTheme();

function App() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(''); // Almacenará el ID (Guid)
    const [selectedPosition, setSelectedPosition] = useState('');     // Almacenará el ID (Guid)
    const [editingUser, setEditingUser] = useState(null); // Usuario completo a editar (UserDto)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Filtrar Departamentos y Cargos Activos ---
    // Usamos useMemo para no recalcular en cada render a menos que cambien las dependencias
    const activeDepartments = useMemo(() => departments.filter(d => d.activo), [departments]);
    const activePositions = useMemo(() => positions.filter(p => p.activo), [positions]);

    // --- Filtrar Usuarios Basado en Selección ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const deptMatch = !selectedDepartment || user.departamento?.id === selectedDepartment;
            const posMatch = !selectedPosition || user.cargo?.id === selectedPosition;
            return deptMatch && posMatch;
        });
    }, [users, selectedDepartment, selectedPosition]);

    // --- Funciones para Cargar Datos ---
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.getUsers();
            setUsers(response.data || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("No se pudieron cargar los usuarios. Asegúrate de que el backend esté corriendo y CORS configurado.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchMetadata = useCallback(async () => {
        // No ponemos loading/error aquí para no interferir con la carga de usuarios
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

    // --- Cargar Datos Iniciales ---
    useEffect(() => {
        fetchMetadata();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Ejecutar solo una vez al montar

    // --- Manejadores de Acciones ---
    const handleEdit = (user) => {
        setEditingUser(user); // Guarda el objeto UserDto completo
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => { // Recibe el Guid ID
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                setIsLoading(true); // Podrías tener un loading específico para delete
                await api.deleteUser(userId);
                // Vuelve a cargar la lista (o filtra localmente)
                fetchUsers(); // Más simple recargar
                // setUsers(currentUsers => currentUsers.filter(u => u.id !== userId));
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
        // userDataFromForm viene del modal y contiene los campos básicos + IDs de depto/cargo
        setError(null); // Limpia errores previos
        try {
             // 1. Encuentra los objetos completos de Departamento y Cargo basados en los IDs seleccionados
            const selectedDeptObject = departments.find(d => d.id === userDataFromForm.departamentoId);
            const selectedPosObject = positions.find(p => p.id === userDataFromForm.cargoId);

            if (!selectedDeptObject || !selectedPosObject) {
                 setError("Departamento o Cargo seleccionado no es válido.");
                 return; // Detener si no se encontraron los objetos
            }

             // 2. Construye el payload UserDto completo que espera la API
             const payload = {
                id: editingUser ? editingUser.id : "00000000-0000-0000-0000-000000000000", // Backend podría ignorar el ID en POST
                usuario: userDataFromForm.usuario,
                primerNombre: userDataFromForm.primerNombre,
                segundoNombre: userDataFromForm.segundoNombre,
                primerApellido: userDataFromForm.primerApellido,
                segundoApellido: userDataFromForm.segundoApellido,
                departamento: selectedDeptObject, // Objeto completo
                cargo: selectedPosObject,          // Objeto completo
             };
             // Eliminar el ID del payload si es una creación (aunque el backend debería manejarlo)
             if (!editingUser) {
                delete payload.id;
             }


            setIsLoading(true); // Indicar carga durante guardado
            if (editingUser) {
                // Actualizar usuario existente
                await api.updateUser(editingUser.id, payload); // Pasamos el ID (Guid) y el payload
            } else {
                // Crear nuevo usuario
                await api.createUser(payload);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            fetchUsers(); // Recargar la lista después de guardar
        } catch (err) {
            console.error("Error saving user:", err);
            // Intenta obtener un mensaje de error más específico si el backend lo envía
            const errorMsg = err.response?.data?.title || err.response?.data || "Error al guardar el usuario.";
            setError(errorMsg);
             // No cierres el modal en caso de error para que el usuario pueda corregir
             // setIsModalOpen(false);
        } finally {
            setIsLoading(false); // Finalizar carga
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Normaliza estilos y aplica fondo del tema */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> {/* mt: marginTop, mb: marginBottom */}
                <Typography variant="h4" component="h1" gutterBottom>
                    Administración de usuarios
                </Typography>

                <Filters
                    departments={activeDepartments} // Pasa solo los activos
                    positions={activePositions}   // Pasa solo los activos
                    selectedDepartment={selectedDepartment}
                    selectedPosition={selectedPosition}
                    onDepartmentChange={setSelectedDepartment}
                    onPositionChange={setSelectedPosition}
                    onCreateNew={handleCreateNew}
                />

                <Box sx={{ mt: 3 }}> {/* Margen superior */}
                    {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>}
                    {error && !isLoading && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {!isLoading && !error && (
                        <UserTable
                            users={filteredUsers} // Pasa los usuarios ya filtrados
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                     {/* Mostrar el total de registros filtrados */}
                     {!isLoading && <Typography sx={{ mt: 2 }}>Total Registros: {filteredUsers.length}</Typography>}
                </Box>

                {/* El Modal se renderiza aquí pero se controla con isModalOpen */}
                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                    initialData={editingUser} // UserDto completo o null
                    departments={activeDepartments} // Pasa activos para el select del modal
                    positions={activePositions}   // Pasa activos para el select del modal
                    apiError={error} // Pasa el error de API al modal para mostrarlo (opcional)
                />
            </Container>
        </ThemeProvider>
    );
}

export default App;
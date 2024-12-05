import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

axios.defaults.withCredentials = true;

const tokenFromStorage = localStorage.getItem('token');
if (tokenFromStorage) {
    axios.defaults.headers['Authorization'] = `Bearer ${tokenFromStorage}`;
}

const useAppStore = create((set, get) => ({
    user: null,
    token: tokenFromStorage || null,
    isAuthenticated: !!tokenFromStorage,
    isLoading: false,
    isLoadingToken: false,
    isLoadingTasks: false,
    error: null,
    tasks: [],
    taskError: null,
    searchQuery: '',

    getToken: () => get().token,

    setToken: (token) => {
        localStorage.setItem('token', token);
        axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        set({ token, isAuthenticated: true, error: null });
    },

    clearToken: () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers['Authorization'];
        set({ token: null, isAuthenticated: false, user: null });
    },

    setAuthHeaders: () => {
        const token = get().token;
        if (token) {
            axios.defaults.headers['Authorization'] = `Bearer ${token}`;
        }
    },

    verifyToken: async () => {
        set({ isLoadingToken: true, error: null });
        get().setAuthHeaders();

        try {
            const response = await axios.get(`${BASE_URL}/api/verify`);
            const data = response.data;
            if (data.success) {
                set({ user: data.user, isAuthenticated: true, error: null });
            } else {
                set({ error: 'Failed to verify token', isAuthenticated: false, user: null });
                get().clearToken();
            }
        } catch (error) {
            console.error("Error verifying token:", error);
            set({ error: 'Failed to verify token', isAuthenticated: false, user: null });
            get().clearToken();
        } finally {
            set({ isLoadingToken: false });
        }
    },

    signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/signup`, userData);
            if (response.data.success) {
                set({ isLoading: false });
            } else {
                set({ error: response.data.message || 'Failed to sign up', isLoading: false });
            }
        } catch (error) {
            console.error('Error signing up:', error);
            set({ error: 'Failed to sign up', isLoading: false });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials);
            if (response.data.success) {
                const token = response.data.token;
                set({ isLoading: false });
                get().setToken(token);
            } else {
                set({ error: response.data.message || 'Failed to login', isLoading: false });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            set({ error: 'Failed to login', isLoading: false });
        }
    },

    logout: () => {
        get().clearToken();
        set({ user: null, tasks: [] });
    },

    createTask: async (taskData) => {
        set({ isLoadingTasks: true, taskError: null });
        get().setAuthHeaders();
        try {
            const response = await axios.post(`${BASE_URL}/api/tasks`, taskData);
            if (response.data.success) {
                set((state) => ({
                    tasks: [...state.tasks, response.data.task],
                }));
            } else {
                set({ taskError: response.data.message || 'Failed to create task' });
            }
        } catch (error) {
            console.error('Error creating task:', error);
            set({ taskError: 'Failed to create task' });
        } finally {
            set({ isLoadingTasks: false });
        }
    },

    getTasks: async () => {
        set({ isLoadingTasks: true, taskError: null });
        get().setAuthHeaders();
        try {
            const response = await axios.get(`${BASE_URL}/api/tasks`);
            if (response.data.success) {
                set({ tasks: response.data.tasks });
            } else {
                set({ taskError: response.data.message || 'Failed to fetch tasks' });
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            set({ taskError: 'Failed to fetch tasks' });
        } finally {
            set({ isLoadingTasks: false });
        }
    },

    toggleTaskStatus: async (taskId) => {
        set({ isLoadingTasks: true, taskError: null });
        get().setAuthHeaders();
        try {
            const response = await axios.patch(`${BASE_URL}/api/tasks/${taskId}/toggle`);
            if (response.data.success) {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId ? { ...task, is_completed: !task.is_completed } : task
                    ),
                }));
            } else {
                set({ taskError: response.data.message || 'Failed to toggle task status' });
            }
        } catch (error) {
            console.error('Error toggling task status:', error);
            set({ taskError: 'Failed to toggle task status' });
        } finally {
            set({ isLoadingTasks: false });
        }
    },

    updateTask: async (taskId, updatedData) => {
        set({ isLoadingTasks: true, taskError: null });
        get().setAuthHeaders();
        try {
            console.log(updatedData);

            const response = await axios.put(`${BASE_URL}/api/tasks/${taskId}`, updatedData);
            if (response.data.success) {
                console.log(response.data.tasks);

                set({ tasks: response.data.tasks });
            } else {
                set({ taskError: response.data.message || 'Failed to update task' });
            }
        } catch (error) {
            console.error('Error updating task:', error);
            set({ taskError: 'Failed to update task' });
        } finally {
            set({ isLoadingTasks: false });
        }
    },

    deleteTask: async (taskId) => {
        set({ isLoadingTasks: true, taskError: null });
        get().setAuthHeaders();
        try {
            const response = await axios.delete(`${BASE_URL}/api/tasks/${taskId}`);
            if (response.data.success) {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== taskId),
                    isLoadingTasks: false,
                }));
            } else {
                set({ taskError: response.data.message || 'Failed to delete task', isLoadingTasks: false });
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            set({ taskError: 'Failed to delete task', isLoadingTasks: false });
        }
    },

    setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useAppStore;

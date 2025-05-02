import axios from "axios";
import { ISprint } from "../types/ISprint";

// Cliente HTTP con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSprintsController = async (): Promise<ISprint[] | undefined> => {
  try {
    // La respuesta ya es directamente un array de sprints
    const response = await api.get<ISprint[]>(import.meta.env.VITE_SPRINTS_ENDPOINT);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error al obtener sprints - ${err.response?.status}: ${err.message}`);
    } else {
      console.error("Error desconocido al obtener sprints:", err);
    }
    return undefined;
  }
};

// Función para obtener un sprint específico por ID
export const getSprintByIdController = async (id: string): Promise<ISprint | undefined> => {
  try {
    const response = await api.get<ISprint>(`${import.meta.env.VITE_SPRINTS_ENDPOINT}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error al obtener el sprint ${id}:`, err);
    return undefined;
  }
};

// Función para crear un nuevo sprint
export const createSprintController = async (sprint: Omit<ISprint, '_id'>): Promise<ISprint | undefined> => {
  try {
    const response = await api.post<ISprint>(import.meta.env.VITE_SPRINTS_ENDPOINT, sprint);
    return response.data;
  } catch (err) {
    console.error("Error al crear el sprint:", err);
    return undefined;
  }
};

// Función para actualizar un sprint existente
export const updateSprintController = async (id: string, sprint: Partial<ISprint>): Promise<ISprint | undefined> => {
  try {
    const response = await api.put<ISprint>(`${import.meta.env.VITE_SPRINTS_ENDPOINT}/${id}`, sprint);
    return response.data;
  } catch (err) {
    console.error(`Error al actualizar el sprint ${id}:`, err);
    return undefined;
  }
};

// Función para eliminar un sprint
export const deleteSprintController = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`${import.meta.env.VITE_SPRINTS_ENDPOINT}/${id}`);
    return true;
  } catch (err) {
    console.error(`Error al eliminar el sprint ${id}:`, err);
    return false;
  }
};
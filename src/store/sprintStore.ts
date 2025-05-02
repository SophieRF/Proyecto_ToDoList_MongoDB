import { create } from 'zustand';
import { ISprint } from '../types/ISprint';
import { 
  getSprintsController, 
  createSprintController, 
  updateSprintController, 
  deleteSprintController 
} from '../data/sprintController';
import { ITarea } from '../types/ITarea';

interface SprintState {
  sprints: ISprint[];
  loading: boolean;
  error: string | null;
  sprintActivo: ISprint | null; // Agregamos esta propiedad
  
  fetchSprints: () => Promise<void>;
  addSprint: (sprint: Omit<ISprint, '_id'>) => Promise<ISprint | undefined>;
  updateSprint: (id: string, sprint: Partial<ISprint>) => Promise<ISprint | undefined>;
  deleteSprint: (id: string) => Promise<boolean>;
  
  addTarea: (sprintId: string, tarea: ITarea) => Promise<boolean>;
  updateTarea: (sprintId: string, tareaIndex: number, tarea: Partial<ITarea>) => Promise<boolean>;
  deleteTarea: (sprintId: string, tareaIndex: number) => Promise<boolean>;

  setSprintActivo: (sprintId: string | null) => void;
  clearSprintActivo: () => void;
  
}

export const sprintStore = create<SprintState>((set, get) => ({
  sprints: [],
  loading: false,
  error: null,
  sprintActivo: null,
  
  fetchSprints: async () => {
    set({ loading: true, error: null });
    try {
      const sprints = await getSprintsController();
      if (sprints) {
        set({ sprints, loading: false });
      } else {
        set({ error: "No se pudieron cargar los sprints", loading: false });
      }
    } catch (err) {
      set({ error: "Error al cargar los sprints", loading: false });
      throw err;
    }
  },
  
  addSprint: async (sprint) => {
    set({ loading: true, error: null });
    try {
      const newSprint = await createSprintController(sprint);
      if (newSprint) {
        set(state => ({ 
          sprints: [...state.sprints, newSprint],
          loading: false 
        }));
        return newSprint;
      } else {
        set({ error: "No se pudo crear el sprint", loading: false });
        return undefined;
      }
    } catch (err) {
      set({ error: "Error al crear el sprint", loading: false });
      return undefined;
      throw err;
    }
  },
  
  updateSprint: async (id, sprintUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedSprint = await updateSprintController(id, sprintUpdate);
      if (updatedSprint) {
        set(state => ({
          sprints: state.sprints.map(s => s._id === id ? updatedSprint : s),
          loading: false
        }));
        return updatedSprint;
      } else {
        set({ error: "No se pudo actualizar el sprint", loading: false });
        return undefined;
      }
    } catch (err) {
      set({ error: "Error al actualizar el sprint", loading: false });
      return undefined;
      throw err
    }
  },
  
  deleteSprint: async (id) => {
    set({ loading: true, error: null });
    try {
      const success = await deleteSprintController(id);
      if (success) {
        set(state => ({
          sprints: state.sprints.filter(s => s._id !== id),
          loading: false
        }));
        return true;
      } else {
        set({ error: "No se pudo eliminar el sprint", loading: false });
        return false;
      }
    } catch (err) {
      set({ error: "Error al eliminar el sprint", loading: false });
      return false;
      throw err
    }
  },
  
  // Funciones para gestionar tareas dentro de sprints
  addTarea: async (sprintId, tarea) => {
    const sprint = get().sprints.find(s => s._id === sprintId);
    if (!sprint) return false;
    
    const updatedSprint = {
      ...sprint,
      tareas: [...sprint.tareas, tarea]
    };
    
    const result = await get().updateSprint(sprintId, updatedSprint);
    return !!result;
  },
  
  updateTarea: async (sprintId, tareaIndex, tareaUpdate) => {
    const sprint = get().sprints.find(s => s._id === sprintId);
    if (!sprint || !sprint.tareas[tareaIndex]) return false;
    
    const updatedTareas = [...sprint.tareas];
    updatedTareas[tareaIndex] = {
      ...updatedTareas[tareaIndex],
      ...tareaUpdate
    };
    
    const result = await get().updateSprint(sprintId, { tareas: updatedTareas });
    return !!result;
  },
  
  deleteTarea: async (sprintId, tareaIndex) => {
    const sprint = get().sprints.find(s => s._id === sprintId);
    if (!sprint || !sprint.tareas[tareaIndex]) return false;
    
    const updatedTareas = sprint.tareas.filter((_, index) => index !== tareaIndex);
    
    const result = await get().updateSprint(sprintId, { tareas: updatedTareas });
    return !!result;
  },
  setSprintActivo: (sprintId) => {
    if (sprintId === null) {
      set({ sprintActivo: null });
      return;
    }
    
    const { sprints } = get();
    const sprint = sprints.find(s => s._id === sprintId);
    
    if (sprint) {
      set({ sprintActivo: sprint });
    } else {
      console.error(`No se encontró el sprint con ID: ${sprintId}`);
    }
  },
  
  // Limpiar el sprint activo
  clearSprintActivo: () => {
    set({ sprintActivo: null });
  }
}));
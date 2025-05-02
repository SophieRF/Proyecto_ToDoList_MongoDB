import { useShallow } from "zustand/shallow"
import { sprintStore } from "../store/sprintStore"
import { createSprintController, deleteSprintController, getSprintsController, updateSprintController } from "../data/sprintController"
import { ISprint } from "../types/ISprint"
import { useCallback } from "react"
import { ITarea } from "../types/ITarea"

export const useSprints = () => {
    const {sprints, listarSprints, crearSprint, editarSprint, agregarTareaASprint, eliminarTareaDeSprint, eliminarSprint}=sprintStore(
        useShallow((state) => ({
            sprints:state.sprints,
            listarSprints:state.fetchSprints,
            crearSprint:state.addSprint,
            editarSprint:state.updateSprint,
            agregarTareaASprint:state.addTarea,
            editarTareaDeSprint:state.updateTarea,
            eliminarTareaDeSprint:state.deleteTarea,
            eliminarSprint:state.deleteSprint
        }))
    )
    //GET
    const getSprints = useCallback(async () => {
        const data = await getSprintsController();
        if (data) listarSprints()
    }, [listarSprints])

    //POST
    const createSprint = async (sprint: ISprint) => {
      try {
          const nuevoSprint = await crearSprint(sprint); // Await the Promise
          if (!nuevoSprint) {
              throw new Error("Failed to create sprint: 'crearSprint' returned undefined.");
          }
          await createSprintController(nuevoSprint); // Pass the resolved value
      } catch (error) {
          console.log("Error al crear una tarea", error);
          throw error;
      }
  };

    //UPDATE SPRINT
    const updateSprint = async (sprintEditado: ISprint, id: string) => {
       
        editarSprint(id, sprintEditado)
        const estadoPrevio = sprints.find((el) => el._id === sprintEditado._id);
        try {
          
            await updateSprintController(id, sprintEditado)
        } catch (error) {
            if (estadoPrevio) editarSprint(id, estadoPrevio);
            console.log("Error al editar la tarea. Reseteando a estado previo", error)
        }
    }

    //ADD TAREA SPRINT
    const addTareaSprint = async (idSprint: string, nuevaTarea: ITarea) => {
        agregarTareaASprint(idSprint, nuevaTarea)
        const sprintActual = sprints.find((s) => s._id === idSprint);
        if (!sprintActual) return;

        const sprintActualizado: ISprint = {
            ...sprintActual,
            tareas: [...sprintActual.tareas, nuevaTarea],
        };

    try {
      await updateSprintController(idSprint, sprintActualizado);
    } catch (error) {
      console.log("Error al guardar la tarea en el backend", error);
    }
    }

    //UPDATE TAREA SPRINT
    const updateTareaDeSprint = async (sprintId: string, tareaId: string, tareaUpdate: Partial<ITarea>) => {
      // Encuentra el sprint activo en el estado actual
      const sprintActivo = sprints.find(sprint => sprint._id === sprintId);
      
      if (!sprintActivo) {
        console.error("Sprint no encontrado");
        return false;
      }
      
      // Encuentra el índice de la tarea en el array de tareas
      const tareaIndex = sprintActivo.tareas.findIndex(tarea => 
        // Comparamos por un identificador único de la tarea (puedes ajustar esto)
        // Como las tareas no tienen _id en tu estructura, podemos usar el título o alguna otra propiedad única
        tarea.titulo === tareaId
      );
      
      if (tareaIndex === -1) {
        console.error("Tarea no encontrada en el sprint");
        return false;
      }
      
      // Guarda el estado previo para posible rollback
      const tareaPrevia = { ...sprintActivo.tareas[tareaIndex] };
      
      // Actualiza la tarea en el estado local para feedback inmediato
      const tareasActualizadas = [...sprintActivo.tareas];
      tareasActualizadas[tareaIndex] = {
        ...tareasActualizadas[tareaIndex],
        ...tareaUpdate
      };
      
      try {
        // Si estás usando el store Zustand que te mostré anteriormente
        const resultado = await updateSprintController(sprintId, { tareas: tareasActualizadas });
        
        if (!resultado) {
          throw new Error("No se pudo actualizar el sprint");
        }
        
        return true;
      } catch (error) {
        console.error("Error al editar la tarea:", error);

        const rollbackTareas = [...sprintActivo.tareas];
        rollbackTareas[tareaIndex] = tareaPrevia;

        return false;
      }
    };
      
      // DELETE TAREA SPRINT
const deleteTareaSprint = async (idSprint: string, tareaIndex: number) => {
  try {
      // Encuentra el sprint actual
      const sprintActual = sprints.find((s) => s._id === idSprint);
      if (!sprintActual) {
          console.error("No se encontró el sprint con ID:", idSprint);
          return;
      }

      // Verifica que el índice de la tarea sea válido
      if (tareaIndex < 0 || tareaIndex >= sprintActual.tareas.length) {
          console.error("Índice de tarea inválido:", tareaIndex);
          return;
      }

      // Actualiza la UI inmediatamente (optimistic update)
      eliminarTareaDeSprint(idSprint, tareaIndex);

      // Crea un nuevo array de tareas sin la tarea que queremos eliminar
      const tareasActualizadas = sprintActual.tareas.filter((_, index) => index !== tareaIndex);

      // Prepara la actualización del sprint
      const sprintActualizado: Partial<ISprint> = {
          tareas: tareasActualizadas
      };

      // Actualiza el sprint en la base de datos
      await updateSprintController(idSprint, sprintActualizado);

  } catch (error) {
      console.error("Error al borrar la tarea o actualizar el sprint", error);
      // Recupera todos los sprints para sincronizar la UI con el estado del servidor
      getSprints();
  }
};

    //DELETE SPRINT
    const deleteSprint = async (idSprint: string) => {
    
            eliminarSprint(idSprint);
    
            try {
                await deleteSprintController(idSprint);
            } catch (error) {
                console.log(`Error al eliminar la tarea: ${error}`, error)
            }
        }
  return {
    sprints,
    getSprints,
    createSprint,
    updateSprint,
    addTareaSprint,
    updateTareaDeSprint,
    deleteTareaSprint,
    deleteSprint
  }
}

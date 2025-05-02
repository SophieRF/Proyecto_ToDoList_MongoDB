export interface ITarea {
    sprint: string | null;
    titulo: string;
    descripcion: string;
    estado: "Por hacer" | "En progreso" | "Terminada";
    fechaLimite: string;
  }
import { useState } from "react"
import { ISprint } from "../../types/ISprint"
import { sprintStore } from "../../store/sprintStore"
import { useSprints } from "../../hooks/useSprints"
import styles from './SprintEntry.module.css'
import { ModalSprints } from "../ui/ModalSprints/ModalSprints"

interface ISprintProps {
  sprint: ISprint
}

export const SprintEntry = ({ sprint }: ISprintProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [openModalSee, setOpenModalSee] = useState(false);
  const setSprintActivo = sprintStore((state) => state.setSprintActivo)
  const { deleteSprint } = useSprints()

  const handleOpenModalSee = () => {
    setSprintActivo(sprint._id)
    setOpenModalSee(true)
    setOpenModal(true)
  }

  const handleOpenModalEntry = () => {
    setSprintActivo(sprint._id)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModalSee(false)
    setSprintActivo(null)
    setOpenModal(false)
  }

  const handleDelete = () => {
    deleteSprint(sprint._id!);
  };


  return (
    <div className={styles.mainDiv} onClick={() => setSprintActivo(sprint._id)}>
      <h1>{sprint.nombre}</h1>
      <div className={styles.flexDiv}>
        <div>

          <p>{sprint.fechaInicio}</p>
          <p>{sprint.fechaCierre}</p>
        </div>
        <div className={styles.divBotones}>
          <button
            className={styles.botonVisibility}
            onClick={handleOpenModalSee}>
            <span className="material-symbols-outlined">
              visibility
            </span>
          </button>
          <button
            className={styles.botonEdit}
            onClick={handleOpenModalEntry}>
            <span className="material-symbols-outlined">
              edit
            </span>
          </button>
          <button
            className={styles.botonDelete}
            onClick={handleDelete}>
            <span className="material-symbols-outlined">
              delete
            </span>
          </button>
        </div>
      </div>
      {openModal && <ModalSprints activeSprint={sprint} openModalSee={openModalSee} handleCloseModal={handleCloseModal} />}
    </div>
  )
}

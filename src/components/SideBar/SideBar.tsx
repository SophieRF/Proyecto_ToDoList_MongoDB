
import styles from "./SideBar.module.css";
import { useState } from "react";
import { sprintStore } from "../../store/sprintStore";
import { useNavigate } from "react-router-dom";
import { SprintList } from "../ui/SprintList/SprintList";
import { ModalSprints } from "../ui/ModalSprints/ModalSprints";

export const SideBar = () => {
  const navigate = useNavigate()
  const [openModal, setOpenModal] = useState(false);
  const setSprintActivo = sprintStore((state) => state.setSprintActivo)

  const handleOpenModal = () => {
    setSprintActivo(null)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <>
      <div className={styles.sidebar}>
        <button onClick={() => navigate("/Backlog")} className={styles.backlogButton}>Backlog</button>
        <div className={styles.mainContainer}>
            <div className={styles.container}>
              <h2>Lista de Sprints</h2>
              <button
                className={styles.plusButton}
                onClick={handleOpenModal}>
                <span className="material-symbols-outlined">
                  <span className="material-symbols-outlined">
                    add
                  </span>
                </span>
              </button>
            </div>
            <SprintList />
        </div>

      </div>
      {openModal && <ModalSprints activeSprint={null} handleCloseModal={handleCloseModal} openModalSee={false} />}
    </>

  );
};

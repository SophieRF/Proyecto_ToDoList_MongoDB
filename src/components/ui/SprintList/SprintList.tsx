import { useEffect } from "react"
import styles from "./SprintList.module.css"
import { useSprints } from "../../../hooks/useSprints";
import { SprintEntry } from "../../SprintEntry/SprintEntry";
import { sprintStore } from "../../../store/sprintStore";

export const SprintList = () => {
    const { getSprints, sprints } = useSprints()
    const activeSprint = sprintStore((state) => state.sprintActivo);

    useEffect(() => {
        getSprints()
    }, [activeSprint, getSprints]);

    return (
        <div className={styles.mainDiv}>
            {sprints.length > 0 ? sprints.map((sprint, index) => (
                <div key={index}>
                    <SprintEntry sprint={sprint} key={index} />
                </div>
            )) : <p>No hay Sprints que mostrar.</p>}
        </div>
    )
}
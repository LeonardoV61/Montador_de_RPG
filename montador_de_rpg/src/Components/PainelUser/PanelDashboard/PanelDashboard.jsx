import styles from "./styles.PanelDashboard.module.css"
export default function PanelDashboard(props){
  return(
    <>
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <h3>{props.titulo}</h3>
          {
            props.canto == "btn" && <button>+ Nova Campanha</button>
            ||
            props.canto && <span>{props.canto} online</span>
          }
        </div>
        <ul className={styles.list}>
          {props.children}
        </ul>
      </div>
    </>
  )
}
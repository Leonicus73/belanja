import styles from "./CoinsHistory.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function CoinsHistory() {
  const ctx = useContext(ProductContext);
  return (
    <div className={styles.divMain}>
      {" "}
      <div className={styles.divHeader}>
        <button className={styles.buttonBack} onClick={ctx.handlerClickBack}>
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>Coins History</h2>
      </div>
      <p>Features not avaliable yet.</p>
    </div>
  );
}

export default CoinsHistory;

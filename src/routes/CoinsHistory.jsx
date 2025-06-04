import styles from "./CoinsHistory.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import ItemCoinsHistory from "../components/ItemCoinsHistory";

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
      <p className={styles.userCoins}>🪙{ctx.user.coins}</p>
      <div className={styles.divCoinsHistory}>
        {ctx.user.CoinsHistory?.map((history) => (
          <ItemCoinsHistory
            key={history.uuid}
            name={history.name}
            mode={history.mode}
            coins={history.coins}
            date={history.date}
          />
        ))}
      </div>
    </div>
  );
}

export default CoinsHistory;

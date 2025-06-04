import styles from "./ItemCoinsHistory.module.css";

function ItemCoinsHistory({ name, mode, coins, date }) {
  const Statement = () => {
    if (mode === "redeem") {
      return (
        <div>
          <p className={styles.name}>Redeemed Reward -</p>
          <p className={styles.name}>{name}</p>
        </div>
      );
    } else if (mode === "bill") {
      return (
        <div>
          <p className={styles.name}>Settled Bill -</p>
          <p className={styles.name}>{name}</p>
        </div>
      );
    } else if (mode === "friendPaid") {
      return (
        <div>
          <p className={styles.name}>Paid Friend -</p>
          <p className={styles.name}>{name}</p>
        </div>
      );
    }
    return null; //
  };

  const Coins = () => {
    if (mode === "redeem") {
      return (
        <div>
          <p className={styles.coins}>-{coins}</p>
        </div>
      );
    } else if (mode === "bill" || mode === "friendPaid") {
      return (
        <div>
          <p className={styles.coins}>+{coins}</p>
        </div>
      );
    }
    return null; //
  };
  return (
    <div className={styles.divMain}>
      <div className={styles.divNameDate}>
        <Statement />
        {/* <p className={styles.name}>{name}</p> */}
        <p className={styles.date}>{`${date.d} ${date.Month} ${date.y}`}</p>
      </div>
      <Coins />
    </div>
  );
}

export default ItemCoinsHistory;

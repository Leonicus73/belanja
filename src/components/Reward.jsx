import styles from "./Reward.module.css";

function Reward({ rewardId, name, coins, img }) {
  return (
    <div className={styles.divMain}>
      <img className={styles.img} src={img} alt={name}></img>
      <div className={styles.divNameCoins}>
        <p className={styles.pName}>{name}</p>
        <p className={styles.pCoins}>{coins}🪙</p>
      </div>
      <p className={styles.emoji}>🛒</p>
    </div>
  );
}

export default Reward;

import styles from "./RewardsPage.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import { Link } from "react-router-dom";
import rewardsData from "../data/Rewards";
import Reward from "../components/Reward";

function RewardsPage() {
  const ctx = useContext(ProductContext);

  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <button className={styles.buttonBack} onClick={ctx.handlerClickBack}>
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>Rewards</h2>
      </div>
      <div className={styles.divCoinsRewards}>
        <Link className={styles.link} to="/coinsHistory/">
          <div className={styles.divCoins}>
            <p className={styles.pEmoji}>🪙</p>
            <div className={styles.divCoinsText}>
              <p className={styles.pCoinsTop}>{ctx.user.coins} coins</p>
              <p className={styles.pCoinsBtm}>View your coins history</p>
            </div>
            <p className={styles.arrow}>›</p>
          </div>
        </Link>
        <Link className={styles.link} to="/myRewards/">
          {" "}
          <div className={styles.divRewards}>
            <p className={styles.pEmoji}>🎁</p>
            <div className={styles.divCoinsText}>
              <p className={styles.pCoinsTop}>My rewards</p>
              <p className={styles.pCoinsBtm}>View your rewards</p>
            </div>
            <p className={styles.arrow}>›</p>
          </div>
        </Link>
      </div>
      <div className={styles.divRewardsListMap}>
        {rewardsData.map((reward) => (
          <Link
            key={reward.rewardId}
            className={styles.link}
            to={`/rewards/${reward.rewardId}`}
          >
            <Reward
              rewardId={reward.rewardId}
              name={reward.name}
              coins={reward.coins}
              img={reward.img}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RewardsPage;

import styles from "./MyReward.module.css";
import rewardsData from "../data/Rewards";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function MyReward({ rewardId, uuid }) {
  const ctx = useContext(ProductContext);
  const reward = rewardsData.find((reward) => reward.rewardId === rewardId);
  const myReward = ctx.user.myRewards.find((reward) => reward.uuid === uuid);
  return (
    <div className={styles.divMain}>
      <img className={styles.img} src={reward.img} alt={reward.name}></img>
      <p className={styles.pName}>{reward.name}</p>
      <p className={myReward.used ? styles.pUseNowInactive : styles.pUseNow}>
        {myReward.used ? "Used" : "Use Now"}
      </p>
    </div>
  );
}

export default MyReward;

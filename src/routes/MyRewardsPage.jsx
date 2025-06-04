import styles from "./MyRewardsPage.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import MyReward from "../components/MyReward";

function MyRewardsPage() {
  const ctx = useContext(ProductContext);
  const navigate = useNavigate();
  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <button
          className={styles.buttonBack}
          onClick={() => navigate("/rewards")}
        >
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>My Rewards</h2>
      </div>
      <div className={styles.divRewardsListMap}>
        {ctx.user.myRewards?.map((reward) => (
          <Link
            key={reward.uuid}
            className={reward.used ? styles.linkInactive : styles.link}
            to={reward.used ? "/myRewards" : `/myRewards/${reward.uuid}`}
          >
            <MyReward rewardId={reward.rewardId} uuid={reward.uuid} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyRewardsPage;

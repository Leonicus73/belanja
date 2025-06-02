import QRCode from "react-qr-code";
import styles from "./UseRewards.module.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function UseRewards() {
  const { uuid } = useParams();
  const ctx = useContext(ProductContext);
  const reward = ctx.user.myRewards.find((reward) => reward.uuid === uuid);

  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <button className={styles.buttonBack} onClick={ctx.handlerClickBack}>
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>Use Rewards</h2>
      </div>
      <h2 className={styles.rewardName}>{reward.name}</h2>
      <div className={styles.qr}>
        <QRCode value={uuid} />
      </div>

      <p className={styles.text}>
        Please present this page on your mobile device to the cashier at the
        time of redemption.
      </p>

      <button
        className={styles.buttonLong}
        onClick={() => ctx.handleUseReward(uuid)}
      >
        Use
      </button>
    </div>
  );
}

export default UseRewards;

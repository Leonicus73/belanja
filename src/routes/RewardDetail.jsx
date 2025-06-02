import styles from "./RewardDetail.module.css";
import rewardsData from "../data/Rewards";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function RewardDetail() {
  const { rewardId } = useParams();
  const ctx = useContext(ProductContext);

  const reward = rewardsData.find((reward) => reward.rewardId === rewardId);

  const isValidAmount = ctx.user.coins >= reward.coins;

  const ValidateValue = () => {
    if (!isValidAmount) {
      return (
        <p className={styles.message}>Insufficient coins for redemption</p>
      );
    } else {
      return <p className={styles.messageInactive}></p>;
    }
  };

  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <button className={styles.buttonBack} onClick={ctx.handlerClickBack}>
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>Reward Detail</h2>
      </div>
      <ValidateValue />
      <img className={styles.img} src={reward.img} alt={reward.name}></img>
      <div className={styles.divNameCoins}>
        <p className={styles.name}>{reward.name}</p>
        <p className={styles.coins}>{reward.coins}🪙</p>
      </div>
      <div className={styles.divDetails}>
        <p>Avaliable for redemption at all participating merchants.</p>
        <p>Valid til 29 Oct 2025, no minimum spend.</p>
        <p>Valid only within Singapore (excluding airport stores).</p>
        <p>
          Please present the voucher page on your mobile device to the cashier
          at the time of redemption.
        </p>
        <p>
          Once Exchange is submitted using the Belanja Coins, the voucher
          redeemed is strictly non-refundable and non-exchangeable for any form
          of cash or credit.
        </p>
        <p>
          Please note that coupons for redemption are limited on weekly basis,
          and you may check the avaliability of vouchers in the subsequent week.
        </p>
      </div>
      <button
        className={styles.buttonLong}
        disabled={isValidAmount ? false : true}
        onClick={() =>
          ctx.handleRedeemReward({
            name: reward.name,
            coins: reward.coins,
            rewardId: reward.rewardId,
          })
        }
      >
        Redeem
      </button>
    </div>
  );
}

export default RewardDetail;

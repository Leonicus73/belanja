import styles from "./ItemDebtLog.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import { useParams } from "react-router-dom";

function ItemDebtLog({ date, senderId, senderName, newDebt, place, mode }) {
  const ctx = useContext(ProductContext);
  const { friendId } = useParams();
  const friend = ctx.user.friends.find((friend) => friend.id === friendId);
  const Statement = () => {
    if (mode === "bill" && senderId === ctx.user.id) {
      return (
        <div>
          <p className={styles.name}>You Settled Bill -</p>
          <p className={styles.name}>{place}</p>
        </div>
      );
    } else if (mode === "bill" && senderId !== ctx.user.id) {
      return (
        <div>
          <p className={styles.name}>{`${senderName} Settled Bill -`}</p>
          <p className={styles.name}>{place}</p>
        </div>
      );
    } else if (mode === "friendPaid" && senderId === ctx.user.id) {
      return (
        <div>
          <p className={styles.name}>You Paid -</p>
          <p className={styles.name}>{friend.name}</p>
        </div>
      );
    } else if (mode === "friendPaid" && senderId !== ctx.user.id) {
      return (
        <div>
          <p className={styles.name}>{`${senderName} Paid -`}</p>
          <p className={styles.name}>You</p>
        </div>
      );
    }
  };

  const Debt = () => {
    if (mode === "bill" && senderId === ctx.user.id) {
      return (
        <div>
          <p className={styles.minusDebt}>-{newDebt}</p>
        </div>
      );
    } else if (mode === "bill" && senderId !== ctx.user.id) {
      return (
        <div>
          <p className={styles.addDebt}>+{newDebt}</p>
        </div>
      );
    } else if (mode === "friendPaid" && senderId === ctx.user.id) {
      return (
        <div>
          <p className={styles.minusDebt}>-{newDebt}</p>
        </div>
      );
    } else if (mode === "friendPaid" && senderId !== ctx.user.id) {
      return (
        <div>
          <p className={styles.addDebt}>+{newDebt}</p>
        </div>
      );
    }
  };

  return (
    <div className={styles.divMain}>
      <div className={styles.divNameDate}>
        <Statement />
        <p className={styles.date}>{`${date.d} ${date.Month} ${date.y}`}</p>
      </div>
      <Debt />
    </div>
  );
}

export default ItemDebtLog;

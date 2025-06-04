import styles from "./PayFriend.module.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function PayFriend() {
  const { id } = useParams();
  const ctx = useContext(ProductContext);
  const friend = ctx.user.friends.find((friend) => friend.id === id);

  const isValidAmount =
    ctx.payFriendInput >= 0.01 && ctx.payFriendInput <= friend.debt;

  const ValidateValue = () => {
    if (!isValidAmount) {
      return (
        <p className={styles.message}>
          Please enter a value between 0.01 to {Number(friend.debt).toFixed(2)}
        </p>
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
        <h2 className={styles.settlement}>Pay Friend</h2>
      </div>
      <ValidateValue />

      <h2 className={styles.h2FriendName}>{friend.name}</h2>
      <div className={styles.divPayField}>
        <p>Total amount to pay</p>
        <input
          className={styles.inputPayField}
          placeholder="$0.00"
          type="number"
          value={ctx.payFriendInput}
          onChange={ctx.handlerChangePayFriendInput}
        ></input>
      </div>
      <h2 className={styles.total}>{`Paying: $${
        ctx.payFriendInput
      } of $${Number(friend.debt).toFixed(2)}`}</h2>
      <p className={styles.left}>{`$${(
        Number(friend.debt).toFixed(2) - ctx.payFriendInput
      ).toFixed(2)} Left`}</p>
      <div className={styles.divWallet}>
        <p>Belanja Wallet</p>
        <p>{`💷 $${ctx.user.wallet}`}</p>
      </div>
      <p className={styles.coins}>
        You will earn 🪙 {Math.round(ctx.payFriendInput)}
      </p>
      <div className={styles.divButton}>
        <button
          className={styles.buttonPayment}
          disabled={isValidAmount ? false : true}
          onClick={() =>
            ctx.handlerPayFriendSubmit({
              id: id,
              mode: "friendPaid",
              amount: ctx.payFriendInput,
              senderName: ctx.user.name,
              senderId: ctx.user.id,
              place: null,
              coins: Math.round(ctx.payFriendInput),
              name: friend.name,
            })
          }
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}

export default PayFriend;

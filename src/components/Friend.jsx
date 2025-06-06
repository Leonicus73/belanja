import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import styles from "./Friend.module.css";
import { useNavigate } from "react-router-dom";

function Friend({ id, debt }) {
  const ctx = useContext(ProductContext);
  const friend = ctx.userList.find((user) => user.id === id);
  const navigate = useNavigate();

  if (!friend) {
    console.warn("Friend not found in user.friends:", id);
    return <p className={styles.pName}>Friend not found.</p>;
  }

  let debtStatement = (
    <div className={styles.pDetails}>{friend.name} and you are even.</div>
  );

  let actionButton = null;

  if (debt > 0) {
    debtStatement = (
      <div className={styles.pDetails}>
        <span style={{ color: "red" }}>
          {`You owe ${friend.name} ${Number(debt).toFixed(2)}`}.
        </span>
      </div>
    );
    actionButton = (
      <button
        className={styles.buttonActionPay}
        onClick={() => ctx.handlerPayFriend(id)}
      >
        Pay
      </button>
    );
  } else if (debt < 0) {
    debtStatement = (
      <div className={styles.pDetails}>
        <span style={{ color: "rgb(25, 176, 25)" }}>
          {friend.name} owes you ${Math.abs(debt).toFixed(2)}.
        </span>
      </div>
    );
    actionButton = (
      <button
        className={styles.buttonActionNotify}
        onClick={() =>
          ctx.handleNudgeFriend({
            id: id,
            mode: "nudge",
            amount: Math.abs(debt),
            senderName: ctx.user.name,
            senderId: ctx.user.id,
          })
        }
      >
        👉
      </button>
    );
  }

  return (
    <div className={styles.divFriend}>
      <div className={styles.divFriendInner}>
        <div className={styles.divFriendInner2}>
          <img
            className={styles.imgFriend}
            src={friend.avatar}
            alt={friend.name}
          ></img>
          <div className={styles.divDetails}>
            <p className={styles.pName}>{friend.name}</p>
            {debtStatement}
          </div>
          <div className={styles.divButtons}>
            <div className={styles.divAction}>{actionButton}</div>
            <button
              className={styles.log}
              onClick={() => navigate(`/debtLog/${id}`)}
            >
              📒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friend;

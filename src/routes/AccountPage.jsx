import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

import styles from "./AccountPage.module.css";

function AccountPage() {
  const ctx = useContext(ProductContext);
  const navigate = useNavigate();
  return (
    <div className={styles.divMain}>
      <div className={styles.divCard}>
        <h1 className={styles.name}>{ctx.user.name}</h1>
        <img
          className={styles.imgAvatar}
          src={ctx.user.avatar}
          alt="User Photo"
        ></img>
        <h2 className={styles.walletText}>Balenja Wallet</h2>
        <h2 className={styles.wallet}>{`$${Number(ctx.user.wallet).toFixed(
          2
        )}`}</h2>
      </div>
      <div className={styles.divButtons}>
        <button
          className={styles.buttonTopup}
          onClick={() => navigate("/topup")}
        >
          💷 Top up
        </button>
        <button
          className={styles.buttonTopup}
          onClick={() => navigate("/rewards")}
        >
          🎁 Rewards
        </button>
        <button
          className={styles.buttonLogout}
          onClick={ctx.handlerLogoutClick}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AccountPage;

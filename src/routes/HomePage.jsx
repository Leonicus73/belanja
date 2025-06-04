import { useContext } from "react";
import styles from "./HomePage.module.css";
import ProductContext from "../context/ProductContext";
import merchantData from "../data/Merchants";
import { Link } from "react-router-dom";
import Merchant from "../components/Merchant";

function HomePage() {
  const ctx = useContext(ProductContext);
  return (
    <div className={styles.divWhole}>
      <div className={styles.divMain}>
        <div className={styles.leftHeader}>
          <h2 className={styles.h2}>{`Hi ${ctx.user.name}`}</h2>
          <h3 className={styles.h3}>Belanja Wallet</h3>
        </div>

        <div className={styles.rightHeader}>
          <div className={styles.divIcons}>
            <button className={styles.button} onClick={ctx.handlerLogoutClick}>
              ↩
            </button>
            <button
              className={
                ctx.user.notifications.notify
                  ? styles.buttonActive
                  : styles.button
              }
              onClick={ctx.handlerClickNotifications}
            >
              ⩍
            </button>
          </div>
          <div className={styles.divWallet}>
            <h3 className={styles.wallet}>${ctx.user.wallet}</h3>
            <p className={styles.coins}>🪙 {ctx.user.coins.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className={styles.divPromo}>
        <div className={styles.divPromoText}>
          <p className={styles.launch}>
            Launch Promotion <span className={styles.span}>1 Jan - 31 Dec</span>
          </p>
          <p className={styles.promoText}>Earn double 🪙coins when you</p>
          <p className={styles.belanja}>BELANJA!</p>
        </div>
        <img
          className={styles.logo}
          src="/belanja logo_ps_alpha.png"
          alt="Belanja Logo"
        />
      </div>
      <h2 className={styles.h2Merchants}>Merchants</h2>
      <div className={styles.divMerchantList}>
        {merchantData.map((merchant) => (
          <Link
            key={merchant.merchantId}
            className={styles.link}
            to={`/paymentMerchant/${merchant.merchantId}`}
          >
            <Merchant name={merchant.name} img={merchant.img} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

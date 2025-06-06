import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
//https://motion.dev/docs/quick-start
import styles from "./HomePage.module.css";
import ProductContext from "../context/ProductContext";
import merchantData from "../data/Merchants";
import Merchant from "../components/Merchant";

function HomePage() {
  const ctx = useContext(ProductContext);
  const transition = {
    duration: 0.8,
    delay: 6,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 6,
    repeatType: "mirror",
  };
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
      <motion.div
        className={styles.divImg}
        transition={transition}
        animate={{ x: -415 }}
      >
        <img
          transition={transition}
          className={styles.imgDoubleCoins}
          src="/doublecoins_banner_upres_edited.png"
          alt="double coins"
        />

        <img
          transition={transition}
          className={styles.imgDoubleCoins}
          src="/1000coins_upres_edited.png"
          alt="double coins"
        />
      </motion.div>
      {/* <div className={styles.divPromo}>
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
      </div> */}
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

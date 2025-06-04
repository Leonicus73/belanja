import styles from "./MerchantPaymentPage.module.css";
import merchantData from "../data/Merchants";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function MerchantPaymentPage() {
  const { merchantId } = useParams();
  const ctx = useContext(ProductContext);

  const merchant = merchantData.find(
    (merchant) => merchant.merchantId === merchantId
  );

  const ValidateValue = () => {
    if (!ctx.merchant.payment || ctx.merchant.payment <= 0) {
      return <p className={styles.message}>Please enter a positive value</p>;
    } else {
      return <p className={styles.message}></p>;
    }
  };

  return (
    <div>
      <button className={styles.buttonBack} onClick={ctx.handlerClickBack}>
        󠀩󠁽≫
      </button>

      <h2 className={styles.h2BelanjaPay}>Belanja Pay</h2>
      <h2 className={styles.h2MerchantName}>{merchant.name}</h2>
      <p className={styles.address}>
        {merchant.address && `📍${merchant.address}`}
      </p>
      <div className={styles.divPayField}>
        <p>Total amount to pay</p>
        <input
          className={styles.inputPayField}
          placeholder="$0.00"
          type="number"
          onChange={ctx.handlerMerchantPaymentChange}
        ></input>
      </div>
      <ValidateValue />
      <div className={styles.divWallet}>
        <p>Belanja Wallet</p>
        <p>{`💷 $${ctx.user.wallet}`}</p>
      </div>
      <div className={styles.divPaymentWrapped}>
        <div className={styles.divTotalPrice}>
          <p className={styles.pTotal}>Total price</p>
          <p className={styles.pPrice}>{`$${Number(
            ctx.merchant.payment
          ).toFixed(2)}`}</p>
        </div>
        <button
          className={styles.buttonPayment}
          disabled={ctx.merchant.payment <= 0 ? true : false}
          onClick={() =>
            ctx.handlerClickHomepageMerchantMakePayment(merchantId)
          }
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}

export default MerchantPaymentPage;

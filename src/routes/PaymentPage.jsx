import styles from "./PaymentPage.module.css";
import { useContext, useEffect } from "react";
import ProductContext from "../context/ProductContext";
import oneMapAPI from "../api/oneMapAPI";

function PaymentPage() {
  const ctx = useContext(ProductContext);

  async function getReverseGeocode() {
    try {
      const response = await oneMapAPI(ctx.oneMap.access_token).get(
        "/revgeocode",
        {
          params: {
            location: ctx.location.latlong,
            buffer: 100,
            addressType: "All",
            otherFeatures: "N",
          },
        }
      );

      const { BUILDINGNAME, BLOCK, ROAD, POSTALCODE } =
        response.data.GeocodeInfo[0];

      if (BUILDINGNAME === "NIL") {
        BUILDINGNAME === "";
      }

      if (BLOCK === "NIL") {
        BLOCK === "";
      }

      const address =
        `${BUILDINGNAME}, ${BLOCK} ${ROAD}, Singapore ${POSTALCODE}`.toLowerCase();

      ctx.dispatch({
        type: "UPDATE_LOCATION_ADDRESS",
        address,
      });

      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getReverseGeocode();
  }, [ctx.location?.latlong]);

  const ValidateValue = () => {
    if (!ctx.merchant.payment || ctx.merchant.payment <= 0) {
      return <p className={styles.message}>Please enter a positive value</p>;
    } else if (ctx.merchant.payment > Number(ctx.user.wallet)) {
      return <p className={styles.message}>Insufficient fund in wallet</p>;
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
      <h2 className={styles.h2MerchantName}>{ctx.merchant.name}</h2>
      <p className={styles.address}>
        {ctx.location.address && `📍${ctx.location.address}`}
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
          disabled={
            ctx.merchant.payment <= 0 || ctx.merchant.payment > ctx.user.wallet
              ? true
              : false
          }
          onClick={ctx.handlerClickMerchantMakePayment}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;

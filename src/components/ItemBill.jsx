import { useContext } from "react";
import ProductContext from "../context/ProductContext";

import styles from "./ItemBill.module.css";

function ItemBill({ id }) {
  const ctx = useContext(ProductContext);
  const currentBill = ctx.bills.find((bill) => bill.id === id);

  const SettleText = () => {
    if (currentBill.settle && currentBill.mode === "belanja") {
      return (
        <div className={styles.divBelanja}>
          <p className={styles.pBelanja}>BELANJA</p>
        </div>
      );
    } else if (currentBill.settle && currentBill.mode !== "belanja") {
      return (
        <div className={styles.divSettled}>
          <p className={styles.pSettled}>settled</p>
        </div>
      );
    } else {
      return (
        <div className={styles.divUnsettled}>
          <p className={styles.pSettled}>Unsettled</p>
        </div>
      );
    }
  };

  return (
    <div className={styles.divItemBill}>
      <div className={styles.divDate}>
        <p className={styles.pM}>{currentBill.date.Month}</p>
        <p className={styles.pD}>{currentBill.date.d}</p>
      </div>
      <h2 className={styles.billName}>{currentBill.name}</h2>
      <div className={styles.divTotal}>
        <p className={styles.pTotal}>Total Paid</p>
        <p className={styles.pPayment}>{`$${Number(currentBill.payment).toFixed(
          2
        )}`}</p>
      </div>
      <SettleText />
    </div>
  );
}

export default ItemBill;

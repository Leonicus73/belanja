import styles from "./Receipt.module.css";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import Paidyee from "../components/Paidyee";
import { useNavigate } from "react-router-dom";

function Receipt() {
  const { id } = useParams();
  const ctx = useContext(ProductContext);
  const currentBill = ctx.bills.find((bill) => bill.id === id);
  const navigate = useNavigate();

  const user = currentBill.fullPayeeList.find(
    (payee) => payee.id === ctx.user.id
  );
  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <h2 className={styles.h2Bills}>Receipt</h2>
        <hr className={styles.hrLine}></hr>
      </div>
      <h2 className={styles.h2BillName}>{currentBill.name}</h2>
      <p className={styles.address}>
        {ctx.currentBill.location?.address &&
          "📍" + ctx.currentBill.location.address}
      </p>
      <div className={styles.divPaidyeeList}>
        {currentBill.fullPayeeList.map((payee) => (
          <Paidyee key={payee.id} id={payee.id} />
        ))}
      </div>

      <hr className={styles.hrLine}></hr>
      {currentBill.mode === "belanja" ? (
        <h2 className={styles.h2Belanja}>
          You have <span className={styles.span}>BELANJA-ED</span> $
          {Number(currentBill.payment).toFixed(2)}!
        </h2>
      ) : (
        <h2 className={styles.total}>{`You have paid $${Number(
          user.final
        ).toFixed(2)} of $${Number(currentBill.payment).toFixed(2)} `}</h2>
      )}

      <button className={styles.buttonBack} onClick={() => navigate("/bills")}>
        Back
      </button>
    </div>
  );
}

export default Receipt;

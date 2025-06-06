import styles from "./Payee.module.css";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";

function Payee({ id }) {
  const ctx = useContext(ProductContext);

  const user = ctx.userList.find((user) => user.id === id);
  const payee = ctx.currentBill.fullPayeeList.find((payee) => payee.id === id);

  return (
    <div className={styles.divMain}>
      <img className={styles.imgPayee} src={user.avatar} alt={user.name}></img>
      <h4>
        {user.name}
        {user.name === ctx.user.name && (
          <span className={styles.span}> (You)</span>
        )}
      </h4>
      <div className={styles.divSpace}></div>
      {ctx.currentBill.mode !== "%" && ctx.currentBill.mode !== "belanja" && (
        <p className={styles.pSymbol}>$</p>
      )}
      {ctx.currentBill.mode === "belanja" && user.name === ctx.user.name && (
        <p className={styles.pSymbol}>$</p>
      )}
      {ctx.currentBill.mode === "=" && (
        <input
          type="number"
          disabled={true}
          className={styles.input}
          value={
            ctx.currentBill.equal
              ? ctx.currentBill.equal
              : ctx.currentBill.payment
          }
        ></input>
      )}
      {ctx.currentBill.mode === "split" && (
        <input
          type="number"
          className={styles.input}
          placeholder="0.00"
          value={payee && payee.float}
          onChange={(e) => ctx.handlerOnChangePayeeFloatInput(e, id)}
        ></input>
      )}
      {ctx.currentBill.mode === "%" && (
        <input
          type="number"
          className={styles.input}
          placeholder="0"
          value={payee && payee.percentage}
          onChange={(e) => ctx.handlerOnChangePayeePecentageInput(e, id)}
        ></input>
      )}
      {ctx.currentBill.mode === "belanja" && user.name === ctx.user.name && (
        <input
          type="number"
          disabled={true}
          className={styles.input}
          value={ctx.currentBill.payment}
        ></input>
      )}

      {ctx.currentBill.mode === "belanja" && user.name !== ctx.user.name && (
        <p className={styles.pThanks}>Thanks for the Belanja!</p>
      )}

      {ctx.currentBill.mode === "%" && (
        <p className={styles.pSymbolPercentage}>%</p>
      )}
    </div>
  );
}

export default Payee;

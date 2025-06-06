import styles from "./Bill.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import Select from "react-select";
//https://react-select.com/home
import Payee from "../components/Payee";

function Bill() {
  const { id } = useParams();
  const ctx = useContext(ProductContext);
  const currentBill = ctx.bills.find((bill) => bill.id === id);
  const navigate = useNavigate();
  const currentPayee = ctx.currentBill.fullPayeeList.find(
    (payee) => payee.id === ctx.user.id
  );

  const isValidAmount = () => {
    if (
      ctx.currentBill.mode === "split" &&
      ctx.currentBill.floatTotal !== Number(ctx.currentBill.payment)
    ) {
      return false;
    }
    if (
      ctx.currentBill.mode === "%" &&
      ctx.currentBill.percentageTotal !== 100
    ) {
      return false;
    }
    return true;
  };

  let coinsEarned = null;
  if (ctx.currentBill.mode === "=") {
    coinsEarned = Math.round(
      ctx.currentBill.equal ? ctx.currentBill.equal : ctx.currentBill.payment
    );
  } else if (ctx.currentBill.mode === "split") {
    coinsEarned = Math.round(currentPayee.float ? currentPayee.float : 0);
  } else if (ctx.currentBill.mode === "%") {
    coinsEarned = ctx.currentBill.percentageTotal
      ? Math.round((currentPayee.percentage * ctx.currentBill.payment) / 100)
      : "0";
  } else if (ctx.currentBill.mode === "belanja") {
    coinsEarned = Math.round(ctx.currentBill.payment * 2);
  }

  const ValidateValue = () => {
    const isValid = isValidAmount();

    if (!isValid) {
      if (ctx.currentBill.mode === "split") {
        return (
          <p className={styles.message}>
            Total value needs to add up to $
            {Number(ctx.currentBill.payment).toFixed(2)}
          </p>
        );
      }
      if (ctx.currentBill.mode === "%") {
        return (
          <p className={styles.message}>
            Total percentage needs to add up to 100%
          </p>
        );
      }
    }

    return <p className={styles.messageInactive}></p>;
  };

  const findUserAvatar = (userId) => {
    const user = ctx.userList.find((user) => user.id === userId);
    return user ? user.avatar : "https://i.pravatar.cc/100?u=unknown";
  };

  const friendOptions = ctx.user.friends.map((friend) => ({
    value: friend.id,
    label: friend.name,
    avatar: findUserAvatar(friend.id),
  }));

  return (
    <div className={styles.divMain}>
      <div className={styles.divHeader}>
        <button
          className={styles.buttonBack}
          onClick={() => navigate("/bills")}
        >
          󠀩󠁽≫
        </button>
        <h2 className={styles.header}>Bill Settement</h2>
      </div>
      <ValidateValue />

      <h2 className={styles.h2BillName}>{currentBill.name}</h2>
      <p className={styles.address}>
        {ctx.currentBill.location?.address &&
          "📍" + ctx.currentBill.location.address}
      </p>
      <div className={styles.divSelectAndList}>
        <Select
          className={styles.select}
          options={friendOptions}
          closeMenuOnSelect={false}
          isMulti
          onChange={ctx.handlerChangeInputPayee}
          placeholder="Select a friend..."
          formatOptionLabel={(friend) => (
            <div className={styles.divSelect}>
              <img
                src={friend.avatar}
                alt={friend.label}
                className={styles.imgAvatar}
              />
              <span>{friend.label}</span>
            </div>
          )}
        />
        <div className={styles.divOptions}>
          <button
            onClick={() => ctx.handlerClickBillSettleOption("=")}
            className={
              ctx.currentBill.mode === "="
                ? styles.buttonOptionsActive
                : styles.buttonOptions
            }
          >
            =
          </button>
          <button
            onClick={() => ctx.handlerClickBillSettleOption("split")}
            className={
              ctx.currentBill.mode === "split"
                ? styles.buttonOptionsActive
                : styles.buttonOptions
            }
          >
            1.23
          </button>
          <button
            onClick={() => ctx.handlerClickBillSettleOption("%")}
            className={
              ctx.currentBill.mode === "%"
                ? styles.buttonOptionsActive
                : styles.buttonOptions
            }
          >
            %
          </button>
          <button
            onClick={() => ctx.handlerClickBillSettleOption("belanja")}
            className={
              ctx.currentBill.mode === "belanja"
                ? styles.buttonBelanjaActive
                : styles.buttonBelanja
            }
          >
            BELANJA
          </button>
        </div>
        <div className={styles.divPayeeList}>
          {ctx.currentBill.fullPayeeList &&
            ctx.currentBill.fullPayeeList.map((payee) => (
              <Payee key={payee.id} id={payee.id} />
            ))}
        </div>
      </div>

      <hr className={styles.hrLine}></hr>
      {ctx.currentBill.mode === "split" && (
        <>
          <h2 className={styles.total}>{`Total: $${
            ctx.currentBill.floatTotal
              ? Number(ctx.currentBill.floatTotal).toFixed(2)
              : "0.00"
          } of $${Number(ctx.currentBill.payment).toFixed(2)}`}</h2>
          <p className={styles.pLeft}>{`$${
            ctx.currentBill.floatTotal
              ? (
                  Number(currentBill.payment) -
                  Number(ctx.currentBill.floatTotal)
                ).toFixed(2)
              : Number(currentBill.payment).toFixed(2)
          } left`}</p>
        </>
      )}
      {ctx.currentBill.mode === "%" && (
        <>
          <h2 className={styles.total}>{`Total: ${
            ctx.currentBill.percentageTotal
              ? Math.round(ctx.currentBill.percentageTotal)
              : "0"
          }% of 100%`}</h2>
          <p className={styles.pLeft}>{`${
            ctx.currentBill.percentageTotal
              ? Math.floor(100 - Number(ctx.currentBill.percentageTotal))
              : 100
          }% left`}</p>
        </>
      )}
      {ctx.currentBill.mode === "=" && (
        <>
          <h2 className={styles.total}>{`Each will pay $${
            ctx.currentBill.equal
              ? ctx.currentBill.equal
              : ctx.currentBill.payment
          }`}</h2>
          <p className={styles.pLeft}>{`of $${ctx.currentBill.payment} `}</p>
        </>
      )}
      {ctx.currentBill.mode === "belanja" && (
        <>
          <h2 className={styles.total}>{`You will pay the full amount `}</h2>
          <p className={styles.pLeft}>{`of $${ctx.currentBill.payment} `}</p>
        </>
      )}

      {ctx.currentBill.mode === "=" && (
        <>
          <p className={styles.coins}>{`You will earn 🪙${coinsEarned}`}</p>
        </>
      )}

      {ctx.currentBill.mode === "split" && (
        <>
          <p className={styles.coins}>{`You will earn 🪙${coinsEarned}`}</p>
        </>
      )}

      {ctx.currentBill.mode === "%" && (
        <>
          <p className={styles.coins}>{`You will earn 🪙${coinsEarned}`}</p>
        </>
      )}

      {ctx.currentBill.mode === "belanja" && (
        <>
          <p className={styles.coins}>
            {`You will earn 2x coins of 🪙${coinsEarned} `}
            <span className={styles.coinsStrikeOut}>
              {Math.round(ctx.currentBill.payment)}
            </span>
          </p>
        </>
      )}
      <button
        className={styles.buttonSubmit}
        disabled={isValidAmount() ? false : true}
        onClick={() =>
          ctx.handlerBillSubmit({
            billId: id,
            mode: "bill",
            senderName: ctx.user.name,
            senderId: ctx.user.id,
            place: ctx.currentBill.name,
            coins: coinsEarned,
          })
        }
      >
        Submit
      </button>
    </div>
  );
}

export default Bill;

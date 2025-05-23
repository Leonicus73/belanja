import { useContext } from "react";
import ProductContext from "../context/ProductContext";
import Friend from "../components/Friend";
import styles from "./FriendsPage.module.css";

function FriendsPage() {
  const ctx = useContext(ProductContext);
  return (
    <>
      <div className={styles.divHeader}>
        <h2 className={styles.h2Friends}>Friends</h2>
        <hr className={styles.hrLine}></hr>
      </div>

      <div className={styles.divFriendList}>
        <div className={styles.divSearch}>
          <input
            className={styles.inputFriends}
            type="text"
            placeholder="🔍"
          ></input>
          <button className={styles.buttonAdd}>➕</button>
        </div>
        <div className={styles.divFriendListMap}>
          {ctx.user.friends.map((friend) => (
            <Friend key={friend.id} id={friend.id} debt={friend.debt} />
          ))}
        </div>
      </div>
    </>
  );
}

export default FriendsPage;

import { useState, useContext } from "react";
import ProductContext from "../context/ProductContext";
import Friend from "../components/Friend";
import styles from "./FriendsPage.module.css";

function FriendsPage() {
  const ctx = useContext(ProductContext);
  const [newFriendName, setNewFriendName] = useState("");

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      ctx.handlerAddFriend(newFriendName);
      setNewFriendName("");
    }
  };

  // console.log("Friends List in Context:", ctx.user.friends);

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
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="🔍"
          ></input>
          <button className={styles.buttonAdd} onClick={handleAddFriend}>
            ➕
          </button>
        </div>
        <div className={styles.divMsg}>
          <p className={styles.pMsg}>
            {ctx.user?.messages?.msgNudge ? ctx.user.messages.msgNudge : ""}
          </p>
        </div>
        <div className={styles.divFriendListMap}>
          {ctx.user.friends.map((friend) => (
            <Friend key={friend.id} id={friend.id} debt={friend.debt} />
            // <Link
            //   key={friend.id}
            //   to={friend.debt > 0 ? `/payfriend/${friend.id}` : `/friends`}
            //   className={styles.link}
            // >
            //   <Friend key={friend.id} id={friend.id} debt={friend.debt} />
            // </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default FriendsPage;

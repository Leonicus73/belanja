import styles from "./Merchant.module.css";

function Merchant({ name, img }) {
  return (
    <div className={styles.divMain}>
      <img className={styles.img} src={img} alt={name}></img>
      <p className={styles.name}>{name}</p>
    </div>
  );
}

export default Merchant;

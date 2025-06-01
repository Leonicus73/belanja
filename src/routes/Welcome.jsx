import { useNavigate } from "react-router-dom";
import styles from "./Welcome.module.css";
import { useEffect, useContext } from "react";
import ProductContext from "../context/ProductContext";
import mockAPI from "../api/mockAPI";
import fetchToken from "../api/fetchToken";
import oneMapCreds from "../api/oneMapCreds";

function Welcome() {
  const navigate = useNavigate();
  const ctx = useContext(ProductContext);

  const handleLogin = () => {
    navigate("/login");
  };

  //one map token
  async function getToken() {
    try {
      const response = await mockAPI.get("/belanja/1");
      ctx.dispatch({
        type: "SET_TOKEN",
        access_token: response.data.access_token,
        expiry_timestamp: response.data.expiry_timestamp,
      });
      return response.data; // Return the data for chaining
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async function renewToken() {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (currentTimestamp >= ctx.oneMap.expiry_timestamp) {
      console.log("Token Expired");
      try {
        const new_response = await fetchToken().post("/", oneMapCreds);
        ctx.dispatch({
          type: "SET_TOKEN",
          access_token: new_response.data.access_token,
          expiry_timestamp: new_response.data.expiry_timestamp,
        });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      console.log("Token Still Valid");
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    renewToken();
  }, [ctx.oneMap.expiry_timestamp]);

  return (
    <div className={styles.divWelcome}>
      <div className={styles.divTitle}>
        <img className={styles.logo} src="/logo.png" alt="Belanja Logo" />
        <h1 className={styles.title}>Belanja</h1>
      </div>

      <h2 className={styles.spend}>Welcome to Belanja!</h2>
      <p className={styles.spend}>Spend with us and earn rewards today!</p>

      <input
        className={styles.inputMobile}
        name="username"
        placeholder="Enter your mobile number "
        type="Number"
        required
      />

      <button className={styles.buttonLongCreate}>Create New Account</button>

      <p>Have a referral or reward code?</p>
      <button className={styles.buttonLong} onClick={handleLogin}>
        Login
      </button>
      <p className={styles.term}>
        By continuing, you agree to Belanja's{" "}
        <span style={{ textDecoration: "underline" }}>
          terms and conditions
        </span>{" "}
        and <span style={{ textDecoration: "underline" }}>privacy policy</span>
      </p>
    </div>
  );
}

export default Welcome;

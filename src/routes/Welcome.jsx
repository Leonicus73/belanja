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
        renew: false,
      });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  async function renewToken() {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (
      ctx.oneMap?.expiry_timestamp &&
      currentTimestamp >= ctx.oneMap?.expiry_timestamp
    ) {
      console.log("Token Expired");
      try {
        const new_response = await fetchToken().post("", oneMapCreds);
        ctx.dispatch({
          type: "SET_TOKEN",
          access_token: new_response.data.access_token,
          expiry_timestamp: new_response.data.expiry_timestamp,
          renew: true,
        });
        return true;
      } catch (error) {
        console.log(error.message);
        return false;
      }
    } else {
      console.log("Token Still Valid");
      return false;
    }
  }

  async function putToken() {
    try {
      const response = await mockAPI.put("/belanja/1", {
        access_token: ctx.oneMap.access_token,
        expiry_timestamp: ctx.oneMap.expiry_timestamp,
      });
      console.log("Token renewed");

      return response.data;
    } catch (error) {
      console.log(error.message);
      console.log("Token not renewed");
      return null;
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    renewToken();
  }, [ctx.oneMap?.expiry_timestamp]);

  useEffect(() => {
    if (ctx.oneMap.renew === true) {
      putToken();
    }
  }, [ctx.oneMap?.expiry_timestamp]);

  return (
    <div className={styles.divWelcome}>
      <div className={styles.divTitle}>
        <img
          className={styles.logo}
          src="/belanja logo_ps_alpha.png"
          alt="Belanja Logo"
        />
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

      <button
        className={styles.buttonLongCreate}
        onClick={() => navigate("/SignUpPage")}
      >
        Create New Account
      </button>

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

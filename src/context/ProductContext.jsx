import { createContext, useReducer } from "react";
import { productReducer, defaultProduct } from "../reducers/ProductReducers";
import { useNavigate } from "react-router-dom";
import dataUsers from "../data/Users";
import { v4 as uuid } from "uuid";

const ProductContext = createContext();

// const initialState = {
//   loginNameInput: "alan@belanja.com",
//   loginPasswordInput: "80604914",
//   loginError: "",
//   user: null,
// };

export function ProductProvider({ children }) {
  const [state, dispatch] = useReducer(productReducer, defaultProduct);
  const navigate = useNavigate();

  const handlerOnChangeInput = (e) => {
    dispatch({ type: "LOGIN_NAME_INPUT", value: e.target.value });
  };

  const handlerLoginClick = () => {
    const loginInput = state.loginNameInput.trim();
    const passwordInput = state.loginPasswordInput;

    const matchedUser = dataUsers.find(
      (user) => user.email === loginInput || String(user.mobile) === loginInput
    );

    if (!matchedUser) {
      dispatch({ type: "LOGIN_ERROR", value: "User not found" });
      return;
    }

    if (String(matchedUser.password) !== passwordInput) {
      dispatch({ type: "LOGIN_ERROR", value: "Incorrect password" });
      return;
    }

    dispatch({ type: "LOGIN_SUCCESS", payload: matchedUser });
    navigate("/home");
  };

  const handlerOnChangePasswordInput = (e) => {
    dispatch({ type: "LOGIN_PASSWORD_INPUT", value: e.target.value });
  };

  const handlerLogoutClick = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const handlerScanClick = () => {
    dispatch({ type: "SCAN" });
    navigate("/paymentMerchant");
  };

  const handlerMerchantPaymentChange = (e) => {
    dispatch({ type: "MERCHANT_PAYMENT_CHANGE", value: e.target.value });
  };

  const handlerClickBack = () => {
    dispatch({ type: "MERCHANT_BACK" });
    navigate(-1);
  };

  const handlerClickMerchantMakePayment = () => {
    if (!state.merchant.payment || state.merchant.payment <= 0) {
      return;
    } else {
      dispatch({ type: "MERCHANT_MAKE_PAYMENT" });
      navigate("/settle");
    }
  };

  const handlerSettleLater = () => {
    dispatch({ type: "SETTLE_LATER" });
    navigate("/home");
  };

  const handlerSplit = (value) => {
    dispatch({ type: "SPLIT", value: value });
    navigate(`/bill/${state.merchant.id}/`);
  };

  const handlerSplitBelanjaSwitch = (e) => {
    dispatch({ type: "SPLIT_BELANJA_SWITCH", value: e });
  };

  const handlerBillClick = (id) => {
    dispatch({ type: "BILL_CLICK", id: id });
  };

  const handlerClickBillSettleOption = (value) => {
    dispatch({ type: "CLICK_BILL_SETTLE_OPTIONS", value: value });
  };

  const handlerOnChangePayeeFloatInput = (e, id) => {
    dispatch({ type: "PAYEE_FLOAT_INPUT", value: e.target.value, id: id });
  };

  const handlerOnChangePayeePecentageInput = (e, id) => {
    dispatch({ type: "PAYEE_PERCENTAGE_INPUT", value: e.target.value, id: id });
  };

  const handlerChangeInputPayee = (selectedOption, actionMeta) => {
    dispatch({
      type: "CHANGE_INPUT_PAYEE",
      actionMeta: actionMeta,
    });
  };

  const handlerBillSubmit = ({
    id,
    mode,
    amount,
    senderName,
    senderId,
    place,
  }) => {
    dispatch({ type: "BILL_SUBMIT" });
    dispatch({
      type: "SEND_NOTIFICATIONS",
      payload: {
        id,
        mode,
        amount,
        senderName,
        senderId,
        place,
      },
    });
    navigate("/bills");
  };

  const handlerClickNotifications = () => {
    dispatch({ type: "CLICK_NOTIFICATIONS" });
    navigate("/notifications");
  };

  const handlerAddFriend = (name) => {
    // Search for an existing user in userList
    const existingUser = state.userList.find(
      (user) => user.name.toLowerCase() === name.toLowerCase()
    );

    if (existingUser) {
      console.log(`Found existing user: ${existingUser.name}`);
      dispatch({
        type: "ADD_FRIEND",
        payload: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          mobile: existingUser.mobile,
          avatar: existingUser.avatar,
          lifeTimeSpending: existingUser.lifeTimeSpending,
          wallet: existingUser.wallet,
          notifications: existingUser.notifications,
          friends: existingUser.friends,
          bills: existingUser.bills,
        },
      });
    } else {
      console.log(`Creating new friend: ${name}`);
      const newFriend = {
        id: uuid(),
        name: name,
        email: `${name.toLowerCase()}@belanja.com`, // Placeholder email
        mobile: "", // Default blank mobile
        avatar: `https://i.pravatar.cc/100?u=${uuid()}`,
        lifeTimeSpending: 0,
        wallet: 0,
        coins: 22355,
        notifications: { notify: false, list: [] },
        friends: [],
        bills: [],
      };

      dispatch({
        type: "ADD_FRIEND",
        payload: newFriend,
      });
    }
  };

  const handlerSignUp = (name, email, mobile, password) => {
    const existingUser = state.userList.find(
      (user) => user.email === email || user.mobile.toString() === mobile
    );

    if (existingUser) {
      console.warn("User already exists:", existingUser);
      return { error: "User with this email or mobile number already exists." }; // Return error message
    }

    dispatch({
      type: "SIGN_UP",
      payload: { name, email, mobile, password },
    });
    return { success: "User created successfully!" };
  };

  const handlerAddMerchantBill = (newBillData) => {
    const newBill = {
      id: uuid(), // Generate unique UUID
      name: newBillData.name,
      payment: parseFloat(newBillData.payment),
      mode: newBillData.mode,
      settle: false,
      date: {
        d: new Date().getDate(),
        Month: new Date().toLocaleString("default", { month: "short" }),
        year: new Date().getFullYear(),
      },
      fullPayeeList: [
        {
          id: state.user.id, // ✅ Adds logged-in user as a payee
          name: state.user.name,
          float: "",
          percentage: "",
          final: 0,
        },
      ],
    };

    dispatch({
      type: "ADD_MERCHANT_BILL",
      payload: { newBill },
    });
  };

  const handlerChangePayFriendInput = (e) => {
    dispatch({ type: "CHANGE_PAY_FRIEND_INPUT", value: e.target.value });
  };

  const handlerPayFriend = (id) => {
    dispatch({ type: "PAY_FRIEND", id: id });
  };

  const handlerPayFriendSubmit = ({
    id,
    mode,
    amount,
    senderName,
    senderId,
    place,
  }) => {
    dispatch({
      type: "SEND_NOTIFICATIONS",
      payload: {
        id,
        mode,
        amount,
        senderName,
        senderId,
        place,
      },
    });
    dispatch({ type: "PAY_FRIEND_SUBMIT", id: id });
    dispatch({ type: "CLEAR_MESSAGES" });
    navigate(`/payfriend/successful/${id}`);
  };

  const handleNotificationClick = (uuid) => {
    dispatch({ type: "NOTIFICATION_CLICK", uuid: uuid });
  };

  const handleNudgeFriend = ({
    id,
    mode,
    amount,
    senderName,
    senderId,
    place,
  }) => {
    dispatch({
      type: "SEND_NOTIFICATIONS",
      payload: {
        id,
        mode,
        amount,
        senderName,
        senderId,
        place,
      },
    });
    dispatch({ type: "NUDGE_FRIEND", id: id });
  };

  const handleClearMessages = () => {
    dispatch({ type: "CLEAR_MESSAGES" });
  };

  const handleNaviScan = () => {
    dispatch({ type: "GET_LOCATION" });
  };

  const handleRedeemReward = ({ name, coins, rewardId }) => {
    dispatch({ type: "REDEEM_REWARD", payload: { name, coins, rewardId } });
    navigate("/myRewards/");
  };

  const handleUseReward = (uuid) => {
    dispatch({ type: "USE_REWARD", uuid: uuid });
    navigate("/myRewards/");
  };

  const data = {
    userList: state.userList,
    loginNameInput: state.loginNameInput,
    loginPasswordInput: state.loginPasswordInput,
    user: state.user,
    merchant: state.merchant,
    bills: state.bills,
    split_belanja_switch: state.split_belanja_switch,
    currentBill: state.currentBill,
    handlerAddMerchantBill, //NEW
    handlerSignUp, //NEW
    handlerAddFriend, //NEW
    payFriendInput: state.payFriendInput,
    loginError: state.loginError,
    oneMap: state.oneMap,
    location: state.location,
    handlerLoginClick,
    handlerOnChangeInput,
    handlerLogoutClick,
    handlerScanClick,
    handlerMerchantPaymentChange,
    handlerClickBack,
    handlerClickMerchantMakePayment,
    handlerSettleLater,
    handlerSplit,
    handlerSplitBelanjaSwitch,
    handlerBillClick,
    handlerClickBillSettleOption,
    handlerOnChangePayeeFloatInput,
    handlerOnChangePayeePecentageInput,
    handlerChangeInputPayee,
    handlerBillSubmit,
    handlerClickNotifications,
    dispatch,
    handlerPayFriend,
    handlerChangePayFriendInput,
    handlerPayFriendSubmit,
    handleNotificationClick,
    handleNudgeFriend,
    handleClearMessages,
    handlerOnChangePasswordInput,
    handleNaviScan,
    handleRedeemReward,
    handleUseReward,
  };

  return (
    <ProductContext.Provider value={data}>{children}</ProductContext.Provider>
  );
}

export default ProductContext;

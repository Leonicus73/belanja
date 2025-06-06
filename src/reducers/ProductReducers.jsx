import validator from "validator";
import dataUsers from "../data/Users";
import merchantData from "../data/Merchants";
import getRandom from "food-random-module";
import { v4 as uuid } from "uuid";

export const defaultProduct = {
  userList: dataUsers,
  isLoggedIn: false,
  loginNameInput: "alan@belanja.com",
  loginPasswordInput: "80604914",
  loginError: "",
  user: null,
  merchant: {
    id: null,
    name: null,
    payment: null,
    mode: "belanja",
    date: { d: null, m: null, year: null },
  },
  bills: [],
  currentBill: null,
  split_belanja_switch: false,
  payFriendInput: null,
  wallet: 0,
  lifeTimeSpending: 0,
  friends: [],
  notifications: {
    notify: false,
    list: [],
  },
  oneMap: {
    access_token: null,
    expiry_timestamp: null,
    renew: false,
  },
  location: {
    latitude: null,
    longitude: null,
    accuracy: null,
    address: null,
  },
};

export function productReducer(state, action) {
  switch (action.type) {
    case "LOGIN_NAME_INPUT":
      return { ...state, loginNameInput: action.value, loginError: "" };

    case "LOGIN_PASSWORD_INPUT":
      return { ...state, loginPasswordInput: action.value, loginError: "" };

    case "LOGIN_ERROR":
      return { ...state, loginError: action.value };

    case "LOGIN_SUCCESS": {
      let newUser = null;
      if (validator.isEmail(state.loginNameInput)) {
        newUser = state.userList.find(
          (user) => user.email === state.loginNameInput
        );
      } else if (validator.isMobilePhone(state.loginNameInput)) {
        newUser = state.userList.find(
          (user) => user.mobile.toString() === state.loginNameInput
        );
      }
      return {
        ...state,
        isLoggedIn: !!newUser,
        user: newUser,
        bills: Array.isArray(newUser?.bills) ? newUser.bills : [],
      };
    }
    // return {
    //   ...state,
    //   isLoggedIn: true,
    //   userList: dataUsers,
    //   user: action.payload,
    //   loginError: "",
    //   loginNameInput: "",
    //   loginPasswordInput: "",
    //   bills: Array.isArray(action.payload.bills) ? action.payload.bills : [],
    //   wallet: action.payload.wallet ?? 0,
    //   lifeTimeSpending: action.payload.lifeTimeSpending ?? 0,
    //   friends: Array.isArray(action.payload.friends)
    //     ? action.payload.friends
    //     : [],
    //   notifications: action.payload.notifications ?? {
    //     notify: false,
    //     list: [],
    //   },
    // };

    case "LOGOUT": {
      const user = { ...state.user, bills: state.bills };
      // const updatedUserList = state.userList.map((u) =>
      //   u.id === state.user.id ? user : u
      // );
      for (const key in state.userList) {
        if (state.userList[key].id === state.user.id) {
          state.userList[key] = user;
        }
      }

      return {
        ...state,
        // userList: updatedUserList,
        isLoggedIn: false,
        user: null,
        loginNameInput: defaultProduct.loginNameInput,
        loginPasswordInput: defaultProduct.loginPasswordInput,
        loginError: "",
      };
    }

    case "SCAN": {
      const firstName = getRandom("name");
      const lastName = getRandom("type");
      const newMerchantName = firstName.request + " " + lastName.request;
      return {
        ...state,
        merchant: { ...state.merchant, id: uuid(), name: newMerchantName },
      };
    }
    case "MERCHANT_PAYMENT_CHANGE": {
      return {
        ...state,
        merchant: { ...state.merchant, payment: action.value },
      };
    }

    case "MERCHANT_BACK": {
      return {
        ...state,
        merchant: { ...state.merchant, payment: null },
      };
    }

    case "MERCHANT_MAKE_PAYMENT": {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const Month = now.toLocaleDateString("en-US", { month: "short" });
      const year = now.getFullYear();

      const updatedWallet = (
        Number(state.user.wallet) - Number(state.merchant.payment)
      ).toFixed(2);

      return {
        ...state,
        user: {
          ...state.user,
          wallet: updatedWallet,
        },
        merchant: {
          ...state.merchant,
          id: uuid(),
          date: { ...state.date, d: day, m: month, Month: Month, year: year },
          location: state.location,
          settle: false,
        },
      };
    }

    case "SETTLE_LATER": {
      let updatedMerchant = {
        ...state.merchant,
        fullPayeeList: [
          {
            id: state.user.id,
            name: state.user.name,
            float: "",
            percentage: "",
          },
        ],
      };
      const newBills = [updatedMerchant, ...state.bills];
      return {
        ...state,
        bills: newBills,
        user: {
          ...state.user,
          bills: newBills,
        },
        merchant: defaultProduct.merchant,
      };
    }

    case "SPLIT": {
      const updatedMerchant = {
        ...state.merchant,
        fullPayeeList: [
          {
            id: state.user.id,
            name: state.user.name,
            float: "",
            percentage: "",
          },
        ],
      };
      const newBills = [updatedMerchant, ...state.bills];
      return {
        ...state,
        merchant: {
          ...state.merchant,
          mode: action.value,
        },
        bills: newBills,
        currentBill: {
          ...state.merchant,
          mode: action.value,
          settle: false,
          payeeList: [],
          fullPayeeList: [
            {
              id: state.user.id,
              name: state.user.name,
              float: "",
              percentage: "",
            },
          ],
        },
        user: {
          ...state.user,
          bills: newBills,
        },
        split_belanja_switch: false,
      };
    }

    case "SPLIT_BELANJA_SWITCH": {
      let newMode = "belanja";
      if (action.value === false) {
        newMode = "split";
      } else if (action.value === true) {
        newMode = "belanja";
      }
      return {
        ...state,
        split_belanja_switch: action.value,
        currentBill: { ...state.currentBill, mode: newMode },
      };
    }

    case "BILL_CLICK": {
      const newCurrentBill = state.bills.find((bill) => bill.id === action.id);
      return { ...state, currentBill: newCurrentBill };
    }

    case "CLICK_BILL_SETTLE_OPTIONS": {
      return {
        ...state,
        currentBill: { ...state.currentBill, mode: action.value },
      };
    }

    case "PAYEE_FLOAT_INPUT": {
      const payee = state.currentBill.fullPayeeList.find(
        (payee) => payee.id === action.id
      );
      payee.float = action.value;
      const newFloatTotal = state.currentBill.fullPayeeList.reduce(
        (sum, payee) => Number(sum) + Number(payee.float),
        0
      );
      return {
        ...state,
        currentBill: { ...state.currentBill, floatTotal: newFloatTotal },
      };
    }

    case "PAYEE_PERCENTAGE_INPUT": {
      const payee = state.currentBill.fullPayeeList.find(
        (payee) => payee.id === action.id
      );
      const filteredValue = action.value.replace(".", "");
      payee.percentage = filteredValue;
      const newPercentageTotal = state.currentBill.fullPayeeList.reduce(
        (sum, payee) => Number(sum) + Number(payee.percentage),
        0
      );
      return {
        ...state,
        currentBill: {
          ...state.currentBill,
          percentageTotal: newPercentageTotal,
        },
      };
    }

    case "CHANGE_INPUT_PAYEE": {
      // console.log(action.actionMeta);
      let newFullPayeeList = state.currentBill.fullPayeeList;
      let newFloatTotal = state.currentBill.floatTotal;
      let newPercentageTotal = state.currentBill.percentageTotal;
      if (action.actionMeta.action === "select-option") {
        const payee = state.userList.find(
          (payee) => payee.id === action.actionMeta.option.value
        );

        const newPayee = {
          id: payee.id,
          name: payee.name,
          float: "",
          percentage: "",
        };

        newFloatTotal = state.currentBill.floatTotal;

        newFullPayeeList = [...state.currentBill.fullPayeeList, newPayee];
      } else if (action.actionMeta.action === "remove-value") {
        newFullPayeeList = state.currentBill.fullPayeeList.filter(
          (payee) => payee.id !== action.actionMeta.removedValue.value
        );

        newFloatTotal = newFullPayeeList.reduce(
          (sum, payee) => Number(sum) + Number(payee.float),
          0
        );

        newPercentageTotal = newFullPayeeList.reduce(
          (sum, payee) => Number(sum) + Number(payee.percentage),
          0
        );
      } else if (action.actionMeta.action === "clear") {
        newFullPayeeList = state.currentBill.fullPayeeList.filter(
          (payee) => payee.id === state.user.id
        );
        newFloatTotal = newFullPayeeList.reduce(
          (sum, payee) => Number(sum) + Number(payee.float),
          0
        );
        newPercentageTotal = newFullPayeeList.reduce(
          (sum, payee) => Number(sum) + Number(payee.percentage),
          0
        );
      }

      const newEqual = (
        Number(state.currentBill.payment) / Object.keys(newFullPayeeList).length
      ).toFixed(2);

      return {
        ...state,
        currentBill: {
          ...state.currentBill,
          fullPayeeList: newFullPayeeList,
          floatTotal: newFloatTotal,
          percentageTotal: newPercentageTotal,
          equal: newEqual,
        },
      };
    }

    case "BILL_SUBMIT": {
      const newCurrentBill = { ...state.currentBill, settle: true };
      state.currentBill.fullPayeeList.map((payee) => {
        if (newCurrentBill.mode === "=") {
          payee.final = newCurrentBill.equal;
        } else if (newCurrentBill.mode === "split") {
          payee.final = payee.float;
        } else if (newCurrentBill.mode === "%") {
          payee.final = (newCurrentBill.payment / 100) * payee.percentage;
        } else if (newCurrentBill.mode === "belanja") {
          if (payee.name === state.user.name) {
            payee.final = newCurrentBill.payment;
          } else {
            payee.final = 0;
          }
        }
        return payee;
      });

      const newBills = state.bills.map((bill) =>
        bill.id === newCurrentBill.id ? newCurrentBill : bill
      );

      const locatedPayee = {};
      Object.values(state.currentBill.fullPayeeList).forEach((payee) => {
        locatedPayee[payee.id] = payee;
      });

      //To reflect debt change in current user friends list
      const updatedFriends = state.user.friends.map((friend) => {
        if (
          locatedPayee[friend.id] &&
          friend.id === locatedPayee[friend.id].id
        ) {
          return {
            ...friend,
            debt: (
              Number(friend.debt) - Number(locatedPayee[friend.id].final)
            ).toFixed(2),
          };
        }
        return friend;
      });

      //To reflect debt change in overall userlist, so when another user sign in, the chamge will reflect in his/her friendlist
      const updatedUserlist = state.userList.map((payeeUser) => {
        if (
          locatedPayee[payeeUser.id] &&
          payeeUser.id === locatedPayee[payeeUser.id].id &&
          locatedPayee[payeeUser.id].id !== state.user.id
        ) {
          const updatedFriends = payeeUser.friends.map((payeeUserFriend) => {
            if (payeeUserFriend.id === state.user.id) {
              const finalDebt =
                Number(payeeUserFriend.debt) +
                Number(locatedPayee[payeeUser.id].final);
              return {
                ...payeeUserFriend,
                debt: finalDebt.toFixed(2),
              };
            }
            return payeeUserFriend;
          });

          return {
            ...payeeUser,
            friends: updatedFriends,
          };
        }
        return payeeUser;
      });

      const updatedCoins = Number(state.user.coins) + Number(action.coins);

      return {
        ...state,
        userList: updatedUserlist,
        bills: newBills,
        currentBill: newCurrentBill,
        user: {
          ...state.user,
          coins: updatedCoins,
          bills: newBills,
          friends: updatedFriends,
        },
      };
    }

    case "CLICK_NOTIFICATIONS": {
      return {
        ...state,
        user: {
          ...state.user,
          notifications: {
            ...state.user.notifications,
            notify: false,
          },
        },
      };
    }

    case "ADD_FRIEND": {
      console.log("Adding new friend:", action.payload);
      return {
        ...state,
        userList: [...state.userList, action.payload],
        user: {
          ...state.user,
          friends: [...state.user.friends, action.payload],
        },
      };
    }

    case "ADD_MERCHANT_BILL":
      return {
        ...state,
        bills: [...state.bills, action.payload.newBill], //Append new bill
      };

    case "SIGN_UP": {
      // Check if the user already exists
      const existingUser = state.userList.find(
        (user) =>
          user.email === action.payload.email ||
          user.mobile === action.payload.mobile
      );

      if (existingUser) {
        console.warn("User already exists:", existingUser);
        return state; // ✅ Prevent duplicate sign-ups
      }

      // Create new user object
      const newUser = {
        id: uuid(),
        name: action.payload.name,
        email: action.payload.email,
        mobile: action.payload.mobile,
        password: action.payload.password,
        avatar: `https://i.pravatar.cc/100?u=${uuid()}`, // Random avatar
        lifeTimeSpending: 0,
        wallet: 0,
        coins: 1000,
        notifications: { notify: false, list: [] },
        friends: [],
        bills: [],
      };

      console.log("New user signed up:", newUser);

      return {
        ...state,
        userList: [...state.userList, newUser], // ✅ Add new user globally
        user: newUser, // ✅ Log the user in immediately
        isLoggedIn: true,
      };
    }
    case "TOP_UP": {
      const updatedWallet = Number(state.user.wallet) + Number(action.value);
      return {
        ...state,
        user: {
          ...state.user,
          wallet: updatedWallet,
          // wallet: state.user.wallet + action.value,
        },
      };
    }

    case "CHANGE_PAY_FRIEND_INPUT": {
      return {
        ...state,
        payFriendInput: action.value,
      };
    }

    case "PAY_FRIEND": {
      const currentFriend = state.user.friends.find(
        (friend) => friend.id === action.id
      );
      return {
        ...state,
        payFriendInput: Number(currentFriend.debt).toFixed(2),
      };
    }

    case "PAY_FRIEND_SUBMIT": {
      const updatedWallet = (
        Number(state.user.wallet) - Number(state.payFriendInput)
      ).toFixed(2);

      const updatedFriends = state.user.friends.map((friend) => {
        if (friend.id === action.id) {
          return { ...friend, debt: friend.debt - state.payFriendInput };
        }
        return friend;
      });

      //update userList for debt change
      const updatedUserlist = state.userList.map((user) => {
        if (user.id === action.id) {
          const updatedTheirFriends = user.friends.map((theirFriend) => {
            if (theirFriend.id === state.user.id) {
              return {
                ...theirFriend,
                debt: (
                  Number(theirFriend.debt) + Number(state.payFriendInput)
                ).toFixed(2),
              };
            }
            return theirFriend;
          });
          return {
            ...user,
            wallet: (
              Number(user.wallet) + Number(state.payFriendInput)
            ).toFixed(2),
            friends: updatedTheirFriends,
          };
        }
        return user;
      });

      const updatedCoins =
        state.user.coins + Math.round(Number(state.payFriendInput));

      return {
        ...state,
        userList: updatedUserlist,
        user: {
          ...state.user,
          wallet: updatedWallet,
          coins: updatedCoins,
          friends: updatedFriends,
        },
      };
    }

    case "ADD_DEBT_LOG": {
      const { billId, id, mode, amount, senderName, senderId, place } =
        action.payload;
      const now = new Date();
      const currentDate = {
        d: now.getDate(),
        m: now.getMonth() + 1,
        Month: now.toLocaleDateString("en-US", { month: "short" }),
        y: now.getFullYear(),
      };

      let updatedFriends = state.user.friends;
      let updatedUserList = state.userList;

      if (mode === "bill") {
        const bill = state.user.bills.find((bill) => bill.id === billId);
        const locatedPayee = {};
        Object.values(bill.fullPayeeList).forEach((payee) => {
          locatedPayee[payee.id] = payee;
        });

        updatedFriends = state.user.friends.map((friend) => {
          if (
            locatedPayee[friend.id] &&
            friend.id === locatedPayee[friend.id].id
          ) {
            const newDebt = {
              debtId: uuid(),
              date: currentDate,
              senderId,
              senderName,
              mode,
              newDebt: locatedPayee[friend.id].final,
              place,
            };
            return { ...friend, debtLog: [newDebt, ...(friend.debtLog || [])] };
          }
          return friend;
        });

        updatedUserList = state.userList.map((user) => {
          if (locatedPayee[user.id] && user.id !== state.user.id) {
            const updatedFriends = user.friends.map((friend) => {
              if (friend.id === state.user.id) {
                const newDebt = {
                  debtId: uuid(),
                  date: currentDate,
                  senderId: state.user.id,
                  senderName: state.user.name,
                  mode,
                  newDebt: locatedPayee[user.id].final,
                  place,
                };
                return {
                  ...friend,
                  debtLog: [newDebt, ...(friend.debtLog || [])],
                };
              }
              return friend;
            });
            return { ...user, friends: updatedFriends };
          }
          return user;
        });
      } else if (mode === "friendPaid") {
        updatedFriends = state.user.friends.map((friend) => {
          if (friend.id === id) {
            const newDebt = {
              debtId: uuid(),
              date: currentDate,
              senderId,
              senderName,
              mode,
              newDebt: amount,
              place,
            };
            return { ...friend, debtLog: [newDebt, ...(friend.debtLog || [])] };
          }
          return friend;
        });

        updatedUserList = state.userList.map((user) => {
          if (user.id === id) {
            const updatedFriends = user.friends.map((friend) => {
              if (friend.id === state.user.id) {
                const newDebt = {
                  debtId: uuid(),
                  date: currentDate,
                  senderId: state.user.id,
                  senderName: state.user.name,
                  mode,
                  newDebt: amount,
                  place,
                };
                return {
                  ...friend,
                  debtLog: [newDebt, ...(friend.debtLog || [])],
                };
              }
              return friend;
            });
            return { ...user, friends: updatedFriends };
          }
          return user;
        });
      }

      return {
        ...state,
        userList: updatedUserList,
        user: { ...state.user, friends: updatedFriends },
      };
    }

    case "SEND_NOTIFICATIONS": {
      const { id, mode, amount, senderName, senderId, place } = action.payload;
      const now = new Date();
      const currentDate = {
        d: now.getDate(),
        m: now.getMonth() + 1,
        Month: now.toLocaleDateString("en-US", { month: "short" }),
        y: now.getFullYear(),
      };

      if (mode === "friendPaid" || mode === "nudge") {
        const newNotification = {
          id,
          mode,
          amount,
          senderName,
          senderId,
          place,
          notify: true,
          date: currentDate,
          uuid: uuid(),
        };

        const updatedUserList = state.userList.map((user) => {
          if (user.id === id) {
            return {
              ...user,
              notifications: {
                ...user.notifications,
                list: [newNotification, ...user.notifications.list],
                notify: true,
              },
            };
          }
          return user;
        });

        return { ...state, userList: updatedUserList };
      } else if (mode === "bill") {
        const locatedPayee = {};
        Object.values(state.currentBill.fullPayeeList).forEach((payee) => {
          locatedPayee[payee.id] = payee;
        });

        const updatedUserlist = state.userList.map((payeeUser) => {
          if (
            locatedPayee[payeeUser.id] &&
            payeeUser.id === locatedPayee[payeeUser.id].id &&
            locatedPayee[payeeUser.id].id !== state.user.id
          ) {
            const newNotification = {
              id: payeeUser.id,
              mode: state.currentBill.mode,
              amount: locatedPayee[payeeUser.id].final,
              senderName,
              senderId,
              place,
              notify: true,
              date: currentDate,
              uuid: uuid(),
            };
            return {
              ...payeeUser,
              notifications: {
                ...payeeUser.notifications,
                notify: true,
                list: [newNotification, ...payeeUser.notifications.list],
              },
            };
          }
          return payeeUser;
        });

        return { ...state, userList: updatedUserlist };
      }
      return state;
    }

    case "NOTIFICATION_CLICK": {
      const updatedNotifications = state.user.notifications.list.map(
        (notification) => {
          if (notification.uuid === action.uuid) {
            return { ...notification, notify: false };
          }
          return notification;
        }
      );

      return {
        ...state,
        user: {
          ...state.user,
          notifications: {
            ...state.user.notifications,
            list: updatedNotifications,
          },
        },
      };
    }

    case "NUDGE_FRIEND": {
      const friend = state.userList.find((user) => user.id === action.id);
      return {
        ...state,
        user: {
          ...state.user,
          messages: {
            msgNudge: `You have Nudged ${friend.name} for payment.`,
          },
        },
      };
    }

    case "CLEAR_MESSAGES": {
      if (state.user.messages !== null) {
        return {
          ...state,
          user: {
            ...state.user,
            messages: null,
          },
        };
      }
      return { ...state };
    }

    case "UPDATE_LOCATION": {
      return {
        ...state,
        location: {
          latlong: action.latlong,
        },
      };
    }

    case "UPDATE_LOCATION_ADDRESS": {
      return {
        ...state,
        location: { ...state.location, address: action.address },
      };
    }

    case "SET_TOKEN": {
      return {
        ...state,
        oneMap: {
          renew: action.renew,
          access_token: action.access_token,
          expiry_timestamp: action.expiry_timestamp,
        },
      };
    }

    case "REDEEM_REWARD": {
      const { name, coins, rewardId } = action.payload;
      const newReward = {
        uuid: uuid(),
        rewardId,
        name,
        coins,
        used: false,
      };

      const updatedCoins = state.user.coins - coins;

      return {
        ...state,
        user: {
          ...state.user,
          coins: updatedCoins,
          myRewards: [newReward, ...(state.user.myRewards || [])],
        },
      };
    }

    case "USE_REWARD": {
      const updatedMyRewards = state.user.myRewards.map((reward) => {
        if (reward.uuid === action.uuid) {
          return { ...reward, used: true };
        }
        return reward;
      });

      return {
        ...state,
        user: {
          ...state.user,
          myRewards: updatedMyRewards,
        },
      };
    }

    case "COINS_HISTORY": {
      const { name, coins, rewardId, mode } = action.payload;
      const now = new Date();
      const currentDate = {
        d: now.getDate(),
        m: now.getMonth() + 1,
        Month: now.toLocaleDateString("en-US", { month: "short" }),
        y: now.getFullYear(),
      };
      const newCoinsHistory = {
        uuid: uuid(),
        rewardId,
        name,
        coins,
        mode,
        date: currentDate,
      };

      return {
        ...state,
        user: {
          ...state.user,
          CoinsHistory: [newCoinsHistory, ...(state.user.CoinsHistory || [])],
        },
      };
    }

    case "HOMEPAGE_MERCHANT_MAKE_PAYMENT": {
      const now = new Date();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const Month = now.toLocaleDateString("en-US", { month: "short" });
      const year = now.getFullYear();

      const updatedWallet = (
        Number(state.user.wallet) - Number(state.merchant.payment)
      ).toFixed(2);

      console.log(action.merchantId, "merchantId");
      const merchant = merchantData.find(
        (merchant) => merchant.merchantId === action.merchantId
      );

      return {
        ...state,
        user: {
          ...state.user,
          wallet: updatedWallet,
        },
        merchant: {
          ...state.merchant,
          name: merchant.name,
          id: uuid(),
          date: { ...state.date, d: day, m: month, Month: Month, year: year },
          location: { address: merchant.address },
          settle: false,
        },
      };
    }

    default:
      throw Error("productReducer - unknown action:", action.type);
  }
}

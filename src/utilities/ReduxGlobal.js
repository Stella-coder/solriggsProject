import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: {},      // Stores all marketplace products as an object
  cart: [],          // Stores items added to the cart
  userData: [],      // User-specific data (buyers/sellers)
  transactions: [],  // Transaction history
  disputes: [],      // Tracks disputes
  totalCartCost: 0,  // Total cost of all items in the cart
  totalCartQuantity: 0,  // Total quantity of all items in the cart
  installmentState: {
    productId: 'abc123',      // Example product ID (to be replaced dynamically)
    totalPrice: 100,          // Total price of the product
    remainingAmount: 100,     // Remaining amount to be paid
    installmentsPaid: 0,      // Number of installments paid
  }
};

const marketplaceSlice = createSlice({
  name: "Marketplace",
  initialState,
  reducers: {
    addUserData: (state, { payload }) => {
      state.userData.push({ ...payload });
    },

    addProducts: (state, { payload }) => {
      if (Array.isArray(payload)) {
        payload.forEach(product => {
          state.products[product.id] = product;
        });
      } else {
        state.products[payload.id] = payload;
      }
    },

    addToCart: (state, { payload }) => {
      const cartItem = state.cart.find((el) => el.id === payload.id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        state.cart.push({ ...payload, quantity: 1, installmentPaid: 0 });
      }
    },

    updateInstallmentPayment: (state, { payload }) => {
      const cartItem = state.cart.find((el) => el.id === payload.id);
      if (cartItem) {
        cartItem.installmentPaid = payload.installmentPaid;

        if (state.installmentState.productId === payload.id) {
          state.installmentState.remainingAmount -= payload.installmentPaid;
          state.installmentState.installmentsPaid += 1;
        }
      }
    },

    payInstallment: (state, { payload }) => {
      if (state.installmentState.remainingAmount >= payload.amount) {
        state.installmentState.remainingAmount -= payload.amount;
        state.installmentState.installmentsPaid += 1;
      } else {
        console.error("Installment amount exceeds remaining balance");
      }
    },

    changeCartQuantity: (state, { payload }) => {
      const cartItem = state.cart.find((el) => el.id === payload.id);
      if (cartItem) {
        if (payload.changeType === "increment") {
          cartItem.quantity += 1;
        } else if (payload.changeType === "decrement" && cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          state.cart = state.cart.filter((item) => item.id !== payload.id);
        }
      }
    },

    removeFromCart: (state, { payload }) => {
      state.cart = state.cart.filter((item) => item.id !== payload.id);
    },

    calculateTotalCost: (state) => {
      const { totalCost, totalQuantity } = state.cart.reduce(
        (totals, item) => {
          const itemTotal = item.price * item.quantity;
          totals.totalCost += itemTotal;
          totals.totalQuantity += item.quantity;
          return totals;
        },
        { totalCost: 0, totalQuantity: 0 }
      );
      state.totalCartCost = totalCost;
      state.totalCartQuantity = totalQuantity;
    },

    recordTransaction: (state, { payload }) => {
      state.transactions.push({ ...payload });
    },

    createDispute: (state, { payload }) => {
      state.disputes.push({ ...payload });
    },

    settleDispute: (state, { payload }) => {
      const dispute = state.disputes.find((el) => el.id === payload.id);
      if (dispute) {
        dispute.disputeResolved = true;
        dispute.resolutionDetails = payload.resolutionDetails;
      }
    },
  },
});

export const {
  addUserData,
  addProducts,
  addToCart,
  updateInstallmentPayment,
  payInstallment,
  changeCartQuantity,
  removeFromCart,
  calculateTotalCost,
  recordTransaction,
  createDispute,
  settleDispute,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
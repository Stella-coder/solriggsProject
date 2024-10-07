import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],      // Stores all marketplace products
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
    // Add user data (e.g., profile, payment details, seller/buyer info)
    addUserData: (state, { payload }) => {
      state.userData.push({ ...payload });
    },

    // Add products to the marketplace (could be fetched from Firebase/API)
    addProducts: (state, { payload }) => {
      state.products = payload;
    },

    // Add a product to the cart
    addToCart: (state, { payload }) => {
      const productIndex = state.cart.findIndex((el) => el.id === payload.id);
      if (productIndex >= 0) {
        // If product already in cart, increment quantity
        state.cart[productIndex].quantity += 1;
      } else {
        // Add new product to cart with initial quantity of 1
        const newCartItem = { ...payload, quantity: 1, installmentPaid: 0 };
        state.cart.push(newCartItem);
      }
    },
    

    // Update the installment payment status for a product in the cart
    updateInstallmentPayment: (state, { payload }) => {
      const productIndex = state.cart.findIndex((el) => el.id === payload.id);
      if (productIndex >= 0) {
        // Update the installment paid amount
        state.cart[productIndex].installmentPaid = payload.installmentPaid;

        // Adjust the installmentState if tracking specific product
        if (state.installmentState.productId === payload.id) {
          state.installmentState.remainingAmount -= payload.installmentPaid;
          state.installmentState.installmentsPaid += 1;
        }
      }
    },

    // Action to handle paying an installment
    payInstallment: (state, { payload }) => {
      if (state.installmentState.remainingAmount >= payload.amount) {
        state.installmentState.remainingAmount -= payload.amount;
        state.installmentState.installmentsPaid += 1;
      } else {
        console.error("Installment amount exceeds remaining balance");
      }
    },

    // Change the product quantity in the cart (increment or decrement)
    changeCartQuantity: (state, { payload }) => {
      const productIndex = state.cart.findIndex((el) => el.id === payload.id);
      if (productIndex >= 0) {
        if (payload.changeType === "increment") {
          state.cart[productIndex].quantity += 1;
        } else if (payload.changeType === "decrement" && state.cart[productIndex].quantity > 1) {
          state.cart[productIndex].quantity -= 1;
        } else {
          // Remove product if quantity is 1 and user decrements
          state.cart = state.cart.filter((item) => item.id !== payload.id);
        }
      }
    },

    // Remove a product from the cart
    removeFromCart: (state, { payload }) => {
      state.cart = state.cart.filter((item) => item.id !== payload.id);
    },

    // Calculate the total cost for items in the cart, including quantities and installments
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

    // Record a completed transaction
    recordTransaction: (state, { payload }) => {
      state.transactions.push({ ...payload });
    },

    // Create a dispute for a transaction (initiated by buyer or seller)
    createDispute: (state, { payload }) => {
      state.disputes.push({ ...payload });
    },

    // Settle a dispute (resolved by platform or through arbitration)
    settleDispute: (state, { payload }) => {
      const disputeIndex = state.disputes.findIndex((el) => el.id === payload.id);
      if (disputeIndex >= 0) {
        state.disputes[disputeIndex].disputeResolved = true;
        state.disputes[disputeIndex].resolutionDetails = payload.resolutionDetails;
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

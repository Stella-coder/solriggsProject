import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, calculateTotalCost, changeCartQuantity } from "../utilities/ReduxGlobal"; 
import DeleteIcon from '@mui/icons-material/Delete';
import logo from "../assets/logo-no-background.png";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../base'; // Firebase initialization
import { auth } from '../base'; // Import Firebase auth
import { signOut } from "firebase/auth"; // Import signOut function
import { useAuth } from "../utilities/AuthState";

const Header = () => {
  const [toggle, setToggle] = useState(false);
  const [cartToggle, setCartToggle] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [isApproved, setIsApproved] = useState(null); 
  const [role, setRole] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for logged in status
  const [error, setError] = useState(null); // New state for error handling
  const { user } = useAuth(); 


  const dispatch = useDispatch();
  const { cart, totalCartCost } = useSelector(state => state.marketplace);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(calculateTotalCost());
  }, [cart, dispatch]);

  const changeToggle = () => setToggle(prev => !prev);
  const changeCartToggle = () => setCartToggle(prev => !prev);

  const changeBgColor = () => {
    setNavbar(window.scrollY >= 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBgColor);
    return () => window.removeEventListener("scroll", changeBgColor);
  }, []);

  // Fetch company approval status with error handling
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        // Ensure `auth.currentUser` is defined and fetch the user's ID
        const user = auth.currentUser; // Get the current user from Firebase authentication
        if (!user) {
          throw new Error("No user logged in");
        }
        
        const userId = user?.uid; // Get the logged-in user's ID
        const companyRef = doc(firestore, 'companies', userId); // Reference to the user's company data
        const companySnap = await getDoc(companyRef); // Fetch the document
         console.log(companySnap.data())
        if (companySnap.exists()) {
          const { isApproved, role } = companySnap.data(); // Fetch both role and isApproved
          setIsApproved(isApproved);
          setRole(role); 
          console.log("User approval status and role:", isApproved, role);
  
          // If the user is not a company or not approved, redirect or handle it appropriately
          if (role !== "company" || !isApproved) {
            console.error("User is either not a company or not approved");
            navigate("/"); // Redirect to a different page if needed
          }
        } else {
          console.error("Company data does not exist for this user");
        }
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setError("Unable to fetch company data. Please check your connection.");
      } finally {
        setStatusLoading(false); // End the loading state
      }
    };
  
    fetchCompanyData();
  }, [user]);


  // Handle logout with error handling
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setIsLoggedIn(false); // Update logged-in status
      navigate("/"); // Redirect after logout
    } catch (error) {
      console.error("Error logging out: ", error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      {/* Render Header */}
      <MyContainer sx={{ backgroundColor: navbar ? "black" : "white" }}>
        <Wrapper>
          <MenuH onClick={changeToggle}><MenuIcon sx={{ color: "rgb(46,107,98)" }} /></MenuH>
          <Logo>
            <img src={logo} width="120px" height="50px" alt="Logo" />
          </Logo>
          <Wrapper2>
            <Link to="/" style={{ textDecoration: "none", color: "rgb(46,107,98)" }}>
              <MyTypography sx={{ fontSize: "12px" }}>Home</MyTypography>
            </Link>
            <Link to="/products" style={{ textDecoration: "none", color: "rgb(46,107,98)" }}>
              <MyTypography sx={{ fontSize: "12px" }}>Products</MyTypography>
            </Link>
            {isLoggedIn ? ( // Show Logout if user is logged in
              <MyTypography sx={{ fontSize: "12px", cursor: "pointer" }} onClick={handleLogout}>Logout</MyTypography>
            ) : (
              <Link to="/sign" style={{ textDecoration: "none", color: "rgb(46,107,98)" }}>
                <MyTypography sx={{ fontSize: "12px" }}>Login</MyTypography>
              </Link>
            )}
            {isApproved === true && ( // Only show Dashboard link if approved
              <Link to="/dashboard" style={{ textDecoration: "none", color: "rgb(46,107,98)" }}>
                <MyTypography sx={{ fontSize: "12px" }}>Dashboard</MyTypography>
              </Link>
            )}
          </Wrapper2>
          <Cart onClick={changeCartToggle} sx={{ color: "rgb(46,107,98)" }}>
            <ShoppingCartIcon />
            <div style={{ position: "absolute", fontSize: "10px", color: "#DEA954", left: 20, bottom: 0, fontWeight: "bold" }}>
              {cart.length}
            </div>
          </Cart>
        </Wrapper>
      </MyContainer>

      {/* Display error message if any */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Conditionally render approval status */}
      {statusLoading ? (
        <Typography>Loading company status...</Typography>
      ) : isApproved === true ? (
        <Typography variant="h4">Welcome to Your Dashboard</Typography>
      ) : isApproved === false ? (
        <Box sx={{ padding: "20px", textAlign: "center" }}>
          <Typography variant="h5" color="error">
            Your company registration has been rejected. Please contact support.
          </Typography>
        </Box>
      ) : (
        <Typography>No status available</Typography>
      )}

      {/* Mobile Menu Toggle */}
      {toggle && (
        <MobileWrapper>
          <div style={{ width: "100%", display: "flex", justifyContent: "center", cursor: "pointer" }} onClick={changeToggle}>X</div>
          <WrapText>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <MyTypographyMobile onClick={changeToggle} sx={{ fontSize: "12px" }}>Home</MyTypographyMobile>
            </Link>
            <Link to="/products" style={{ textDecoration: "none", color: "white" }}>
              <MyTypographyMobile onClick={changeToggle} sx={{ fontSize: "12px" }}>Products</MyTypographyMobile>
            </Link>
            {isLoggedIn ? ( // Show Logout if user is logged in
              <MyTypographyMobile onClick={handleLogout} sx={{ fontSize: "12px", cursor: "pointer", textDecoration:"none"}}>Logout</MyTypographyMobile>
            ) : (
              <Link to="/sign" style={{ textDecoration: "none", color: "white" }}>
                <MyTypographyMobile onClick={changeToggle} sx={{ fontSize: "12px" }}>Login</MyTypographyMobile>
              </Link>
            )}
            {isApproved === true && ( // Only show Dashboard link if approved
              <Link to="/dashboard" onClick={changeToggle} style={{ textDecoration: "none", color: "white" }}>
                <MyTypographyMobile sx={{ fontSize: "12px" }}>Dashboard</MyTypographyMobile>
              </Link>
            )}
          </WrapText>
        </MobileWrapper>
      )}

      {/* Cart Toggle */}
      {cartToggle && (
        <CartContainer>
          <CartWrapper>
            <CartHeader>
              <HoldH>SIGN IN</HoldH>
              <HoldH>VIEW ORDER</HoldH>
              <div style={{ marginRight: "20px", cursor: "pointer" }} onClick={changeCartToggle}>X</div>
            </CartHeader>
            <HoldScroll>
              {cart.length > 0 ? 
                cart.map((item) => (
                  <CartCard key={item.id}>
                    <Hold>
                      <Text>
                        <Name>{item.name}</Name>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <QuantityButton onClick={() => dispatch(changeCartQuantity({ id: item.id, changeType: "decrement" }))} disabled={item.quantity === 1}>-</QuantityButton>
                          <QuantityText>{item.quantity}</QuantityText>
                          <QuantityButton onClick={() => dispatch(changeCartQuantity({ id: item.id, changeType: "increment" }))}>+</QuantityButton>
                        </div>
                      </Text>
                      <Delete onClick={() => dispatch(removeFromCart(item.id))}><DeleteIcon /></Delete>
                    </Hold>
                  </CartCard>
                ))
              : <div>No items in cart</div>}
            </HoldScroll>
            <HoldButton>
              <TotalText>Total: ${totalCartCost}</TotalText>
              <OrderButton>View Order</OrderButton>
            </HoldButton>
          </CartWrapper>
        </CartContainer>
      )}
    </>
  );
};

export default Header;



// Styled Components
const MyContainer = styled(Box)({
  width: "100%",
  height:"80px",
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 100,
  display: "flex",
  justifyContent: "center",
  // padding: "10px 0",
  transition: "background-color 0.3s ease",
});

const Wrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "90%",
  margin: "0 auto",
});

const Logo = styled("div")({
  display: "flex",
  alignItems: "center",
  cursor: "pointer"
});

const WrapText = styled("div")({
  display: "flex",
  flexDirection: 'column',
  height: "50vh",
  justifyContent: "space-around",
  padding: "0px 20px",
});

const MenuH = styled("div")({
  "@media screen and (min-width: 768px)": {
    display: "none"
  }
});

const Wrapper2 = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  width: "400px",
  "@media screen and (max-width: 768px)": {
    display: "none"
  }
});

const Cart = styled(Box)({
  display: "flex",
  position: "relative",
  cursor: "pointer"
});

const MobileWrapper = styled(Box)({
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(46,107,98, 0.99)",
  display: "flex",
  color: "white",
  position: "fixed",
  flexDirection: 'column',
  zIndex: 1000,
  "@media screen and (min-width: 768px)": {
    display: "none"
  }
});

const MyTypography = styled("div")({
  fontSize: "11px",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 350ms",
  "&:hover": {
    color: "#DEA954",
  }
});

const MyTypographyMobile = styled("div")({
  fontSize: "11px",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 350ms",
  borderBottom: "1px solid #DEA954",
  padding: "5px 0px",
});

const CartContainer = styled("div")({
  width: "100%",
  height: "100vh",
  backgroundColor: "rgba(0,100,0,0.2)",
  position: "fixed",
  display: "flex",
  justifyContent: "flex-end",
  color: "white",
  zIndex: 100,
});

const CartWrapper = styled("div")({
  width: "400px",
  maxHeight: "70vh", // Limit height to ensure all items can fit
  backgroundColor: "rgb(0,100,0)",
  marginTop: "80px",
  marginRight: "20px",
  borderTop: "1px solid #DEA954",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "auto", // Enable scrolling only if necessary
  "@media screen and (max-width: 768px)": {
    width: "100vw",
    height: "100vh",
    margin: 0,
  }
});

const CartHeader = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  padding: "10px 0px",
  borderBottom: "1px solid #DEA954",
});

const HoldH = styled("div")({
  fontSize: "16px",
  fontWeight: "bold",
});

const HoldScroll = styled("div")({
  width: "100%",
  height: "calc(100% - 100px)",
  overflowY: "hidden", // Remove scrolling
});

const CartCard = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "10px 0px",
  borderBottom: "1px solid #DEA954",
  alignItems: "center" // Align items vertically centered
});

const Hold = styled("div")({
  display: "flex",
  alignItems: "center",
});

const Text = styled("div")({
  display: "flex",
  flexDirection: "column",
});

const Name = styled("div")({
  fontWeight: "bold",
});

const Price = styled("div")({
  color: "#DEA954",
});

const CartImage = styled("img")({
  width: "50px",
  height: "50px",
  objectFit: "cover",
  marginLeft: "20px"
});

const DeleteIconHold = styled("div")({
  cursor: "pointer",
  display: "flex", // Flexbox for proper alignment
  alignItems: "center" // Center the icon vertically
});

const SubTotal = styled("div")({
  marginTop: "10px",
  fontSize: "16px",
  fontWeight: "bold",
});

const Checkout = styled("div")({
  margin: "20px 0px",
  padding: "10px",
  backgroundColor: "#DEA954",
  color: "white",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "5px"
});

// New styled components for quantity buttons
const QuantityButton = styled("button")({
  backgroundColor: "transparent",
  border: "1px solid #DEA954",
  borderRadius: "5px",
  color: "#DEA954",
  cursor: "pointer",
  width: "30px",
  height: "30px",
  margin: "0 5px",
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});


const QuantityText = styled('div')(({ theme }) => ({
  padding: "0 10px",
  fontSize: "16px",
  fontWeight: "bold",
}));

const Delete = styled('div')(({ theme }) => ({
  cursor: "pointer",
  color: theme.palette.error.main,
  marginLeft: "10px",
}));

const HoldButton = styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 20px",
  alignItems: "center",
}));

const TotalText = styled('div')(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "bold",
}));

const OrderButton = styled('button')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  fontSize: "14px",
  borderRadius: "5px",
}));
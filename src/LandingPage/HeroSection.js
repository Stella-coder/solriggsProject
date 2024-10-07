import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles"; // Updated import
import image1 from "../assets/image1.jpg"
import { Link } from "react-router-dom";

const HeroSection = () => {
    return (
        <MyBox>
            <BdgImg>
                <Modal>
                    <Text >
                        SolRiggs: Powering Tommorow
                        <div style={{fontSize:"25px"}}> We make energy affordable for all through secure and installment payment. </div>
                        <Link to = "/products">
                        <Button sx={{bgcolor :"#DEA954", padding:"10px 20px", color:"white", }} >Buy Now</Button>
                        </Link>
                    </Text>
                </Modal>
            </BdgImg>
        </MyBox>
    );
};

export default HeroSection;

const MyBox = styled(Box)({
    height: "80vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "@media screen and (max-width: 768px)": {
        height: "60vh",
    },
});

const BdgImg = styled(Box)({
    height: "100%",
    width: "100%",
    // Uncomment and provide a valid image URL if needed
    backgroundImage: `url(${image1})`,
    backgroundColor: "darkgreen",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center", // Corrected property value
});

const Modal = styled(Box)({
    height: "100%",
    width: "100%",
    background: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(1px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
});

const Text = styled("div")({
    fontSize: "50px",
    fontWeight: "bold",
    color: "white",
    padding: "20px 0px",
    
    "@media screen and (max-width: 768px)": {
        fontSize: "30px",
    },
});

const ButtonB = styled(Box)({
    backgroundColor: "darkblue",
    borderRadius: "10px",
    padding: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
});

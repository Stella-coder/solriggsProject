import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/system";
import { useParams, Link } from "react-router-dom";
import { addProducts } from "../utilities/ReduxGlobal";
import { firestore } from "../base";
import { doc, getDoc } from "firebase/firestore";

const ProductDetail = () => {
  const { companyUid, productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.marketplace.products[productId]);
  const [loading, setLoading] = useState(!product);

  useEffect(() => {
    if (!product) {
      (async () => {
        try {
          const productRef = doc(firestore, `companies/${companyUid}/products/${productId}`);
          const productSnapshot = await getDoc(productRef);

          if (productSnapshot.exists()) {
            const productData = {
              id: productSnapshot.id,
              ...productSnapshot.data(),
            };
            dispatch(addProducts(productData));
          } else {
            console.warn("Product not found. Loading dummy data.");
            const dummyProduct = {
              id: productId,
              name: "Sample Solar Panel",
              price: 25000,
              energyOutput: "250W",
              description: "High-efficiency solar panel for residential use.",
              image: "https://via.placeholder.com/400",
            };
            dispatch(addProducts(dummyProduct));
          }
        } catch (error) {
          console.error("Error fetching product details: ", error);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [companyUid, productId, dispatch, product]);

  if (loading) return <Loading minHeight="100vh">Loading product details...</Loading>;
  if (!product) return <div>Product not found</div>;

  return (
    <Container minHeight="100vh">
      <Wrapper>
        <ImageWrapper>
          <Image src={product.image} alt={product.name} />
        </ImageWrapper>
        <Info>
          <Title>{product.name}</Title>
          <Price>Price: #{product.price}</Price>
          <Category>Energy Output: {product.energyOutput}</Category>
          <Description>{product.description}</Description>
          <Link to="/checkout" state={{ productId: product.id }}>
            <ActionButton>Checkout</ActionButton>
          </Link>
        </Info>
      </Wrapper>
    </Container>
  );
};

export default ProductDetail;

// Styled Components
const Container = styled("div")(({ minHeight }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight,
  backgroundColor: "#f9f9f9",
  padding: "20px",
}));

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  maxWidth: "900px",
  width: "100%",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
});

const ImageWrapper = styled("div")({
  flex: "1 1 50%",
  maxWidth: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
});

const Image = styled("img")({
  width: "100%",
  height: "auto",
  maxHeight: "400px",
  objectFit: "contain",
  borderRadius: "8px",
});

const Info = styled("div")({
  flex: "1 1 50%",
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const Title = styled("h2")({
  fontSize: "1.8rem",
  fontWeight: "600",
  marginBottom: "15px",
  color: "#333",
});

const Price = styled("p")({
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#444",
  marginBottom: "10px",
});

const Category = styled("p")({
  fontSize: "1rem",
  color: "#666",
  marginBottom: "20px",
});

const Description = styled("p")({
  fontSize: "0.95rem",
  color: "#555",
  lineHeight: "1.5",
  marginBottom: "25px",
});

const ActionButton = styled("button")({
  padding: "12px 20px",
  backgroundColor: "rgb(46,107,98)",
  color: "white",
  fontSize: "1rem",
  fontWeight: "600",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  alignSelf: "center",
  "&:hover": {
    backgroundColor: "#DEA954",
  },
});

const Loading = styled("div")(({ minHeight }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight,
  fontSize: "1.5rem",
  color: "#666",
  textAlign: "center",
}));
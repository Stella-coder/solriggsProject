// Imports
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import pool from "../assets/image1.jpg";
import { firestore } from '../base';
import { collectionGroup, getDocs } from 'firebase/firestore';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productData = await getDocs(collectionGroup(firestore, "products"));
      const items = productData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        companyUid: doc.ref.parent.parent.id, // Access the company's UID
      }));
      setProducts((prevProducts) => [...prevProducts, ...items]); // Add new items to existing state
      setFilteredProducts((prevFiltered) => [...prevFiltered, ...items]); // Update filtered products
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleViewMore = (companyUid, productId) => {
    navigate(`/product/${companyUid}/${productId}`);
  };

  return (
    <Container>
      <Wrapper>
        <Header>
          <Overlay />
          <Content>
            <Title>SolRiggs Products</Title>
            <Subtitle>Your trusted source for renewable energy</Subtitle>
          </Content>
        </Header>

        <SearchInput
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Room>
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <Img src={product.image || pool} alt={product.name} /> {/* Default image for missing image */}
              <Text>
                <Name>{product.name}</Name>
                <Price>#{product.price}</Price>
                <Category>Energy Output: {product.energyOutput}</Category>

                <ActionButton onClick={() => console.log("Add to Cart")}>
                  Add to Cart
                </ActionButton>
                <ActionButton onClick={() => handleViewMore(product.companyUid, product.id)}>
                  View More 
                </ActionButton>
              </Text>
            </Card>
          ))}
          {loading && <LoadingMessage>Loading more products...</LoadingMessage>}
        </Room>
      </Wrapper>
    </Container>
  );
};

export default Products;

// Styled Components
const Container = styled("div")({
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
});

const Wrapper = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const Header = styled("div")({
  width: "100%",
  height: "250px",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: `url(${pool})`,
  backgroundPosition: "center",
  backgroundSize: "cover",
});

const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

const Content = styled("div")({
  color: "#fff",
  textAlign: "center",
  zIndex: 1,
});

const Title = styled("h1")({
  fontSize: "3rem",
});

const Subtitle = styled("span")({
  fontSize: "1.2rem",
  marginTop: "10px",
  display: "block",
});

const SearchInput = styled("input")({
  width: "80%",
  padding: "10px",
  margin: "20px auto",
  display: "block",
  fontSize: "1rem",
});

const Room = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
});

const Card = styled("div")({
  width: "280px",
  margin: "20px",
  padding: "20px",
  boxShadow: "0 3px 8px rgba(0, 0, 0, 0.24)",
});

const Img = styled("img")({
  width: "100%",
  height: "200px",
  objectFit: "cover",
});

const Text = styled("div")({
  textAlign: "center",
  marginTop: "10px",
});

const Name = styled("div")({
  fontSize: "1.5rem",
  fontWeight: "bold",
});

const Price = styled("div")({
  fontSize: "1rem",
  margin: "5px 0",
  fontWeight: "bold",
});

const Category = styled("div")({
  fontSize: "0.9rem",
  color: "gray",
});

const ActionButton = styled("button")({
  margin: "10px",
  padding: "10px 20px",
  backgroundColor: "rgb(46,107,98)",
  color: "white",
  border: "none",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#DEA954",
  },
});

const LoadingMessage = styled("div")({
  width: "100%",
  textAlign: "center",
  padding: "20px",
  fontSize: "1.2rem",
  color: "gray",
});

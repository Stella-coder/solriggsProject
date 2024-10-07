import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom"; // For navigation
import { addProducts, addToCart } from '../utilities/ReduxGlobal'; // Import Redux actions
import { firestore } from '../base'; // Import Firebase configuration
import { collectionGroup, getDocs } from 'firebase/firestore'; // For querying sub-collections
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Import an icon from MUI

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.marketplace.products); // Redux store products
  const [randomProducts, setRandomProducts] = useState([]);

  // Fetching products from all companies' Firestore sub-collections
  const fetchProducts = async () => {
    try {
        const productData = await getDocs(collectionGroup(firestore, "products"));
        const items = productData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          companyUid: doc.ref.parent.parent.id, // Access the company's UID
        }));      
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
  };

  // Randomize products to display different ones
  const getRandomProducts = () => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4); // Pick 8 random products
  };

  // Fetch and randomize products
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setRandomProducts(getRandomProducts());
    }
  }, [products]);

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Handle navigation to product details page
  const handleViewMore = ( companyUid, productId) => {
    navigate(`/product/${companyUid}/${productId}`);
  };
  // Navigate to All Products page
  const handleNavigateToAllProducts = () => {
  navigate("/products");
  };

  return (
    <Container>
      <Wrapper>
        
        <Head>Explore Our Products</Head>

        <Room>
          {randomProducts.map((product) => (
            <Card key={product.id}>
              <Img src={product.image || 'default-placeholder-image-url'} alt={product.name} />
              <Text>
                <Name>{product.name}</Name>
                <Price>#{product.price}</Price>
                <Category>Energy Output :{product.energyOutput}</Category>

                <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
                <Button onClick={() => handleViewMore(product.id)}>View More {product.uid}</Button>
              </Text>
            </Card>
          ))}
        </Room>

        {/* Button to navigate to all products */}
        <AllProductsSection onClick={handleNavigateToAllProducts}>
          <span>See All Products</span>
          <ArrowForwardIcon />
        </AllProductsSection>
      </Wrapper>
    </Container>
  );
};

export default ProductsPage;

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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f5f5f5", // Removed background image
  backgroundPosition: "center",
  backgroundSize: "cover",
});

const Content = styled("div")({
  color: "#000",
  textAlign: "center",
});

const Title = styled("h1")({
  fontSize: "3rem",
});

const Head = styled("div")({
  color: "black",
  fontSize: "2rem",
  fontWeight: "bold",
  marginBottom: "10px",
  marginTop: "30px",
  textAlign: "center",
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
});

const Category = styled("div")({
  fontSize: "0.9rem",
  color: "gray",
});

const Button = styled("button")({
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

// Styled for All Products Section with Icon
const AllProductsSection = styled("div")({
  marginTop: "50px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  color: "black",
  fontSize: "1.2rem",
  "&:hover": {
    color: "rgb(46,107,98)",
  },
  "& span": {
    marginRight: "8px",
  },
});

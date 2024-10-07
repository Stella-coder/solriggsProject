import React, { useState } from "react";
import { Button, TextField, Box, Typography, CircularProgress } from "@mui/material";
import signImg from "../assets/image1.jpg";
import imgAvatar from "../assets/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore, storage } from "../base";
import firebase from "firebase/compat/app";

const userDb = firestore.collection("user");
const companyDb = firestore.collection("company");

const SignPage = () => {
  const navigate =useNavigate();

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [hasAccount, setHasAccount] = useState(false);
  const [image, setImage] = useState(imgAvatar);
  const [avatar, setAvatar] = useState("");
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("user");

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setName("");
    setAvatar("");
    setImage(imgAvatar); // Reset image to default avatar
  };

  const signIn2 = async () => {
    clearErrors();
    try {
      const saveUser = await auth.signInWithEmailAndPassword(email, password);
      alert("Company Login successful!");
      clearInputs();
      navigate("/dashboard");
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/invalid-email":
          setEmailError(err.message);
          break;
        case "auth/wrong-password":
          setPasswordError(err.message);
          break;
        default:
          setEmailError(err.message);
      }
    }
  };

  const SignUp = async () => {
    if (loading) {
      alert("Please wait until the image upload is complete.");
      return;
    }

    clearErrors();
    const db = selectedOption === "company" ? companyDb : userDb;
    try {
      const saveUser = await auth.createUserWithEmailAndPassword(email, password);
      await db.doc(saveUser.user.uid).set({
        avatar,
        name,
        email,
        password,
        createdBy: saveUser.user.uid,
      });
      alert("Sign up successful!");
      clearInputs();
      navigate("/home");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
          setEmailError(err.message);
          break;
        case "auth/weak-password":
          setPasswordError(err.message);
          break;
        default:
          setEmailError(err.message);
      }
    }
  };

  const GoogleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const saveUser = await auth.signInWithPopup(provider);
      const db = selectedOption === "company" ? companyDb : userDb;
      if (saveUser) {
        await db.doc(saveUser.user.uid).set({
          avatar: saveUser.user.photoURL,
          name: saveUser.user.displayName,
          email: saveUser.user.email,
          createdBy: saveUser.user.uid,
        });
        alert("Google login successful!");
        clearInputs();
        navigate("/home");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    const save = URL.createObjectURL(file);
    setImage(save);

    setLoading(true); // Set loading state to true during upload

    const fileRef = storage.ref();
    const storeRef = fileRef.child("avatar/" + file.name).put(file);

    storeRef.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const counter = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPercent(counter);
      },
      (err) => {
        console.log(err.message);
        setLoading(false); // Stop loading on error
      },
      () => {
        storeRef.snapshot.ref.getDownloadURL().then((URL) => {
          setAvatar(URL);
          setLoading(false); // Stop loading when upload completes
        });
      }
    );
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
        paddingTop: "50px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: { xs: "100%", md: "70%" },
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Left side image */}
        <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
          <img src={signImg} alt="Sign Up" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        {/* Sign Up / Sign In form */}
        <Box sx={{ flex: 2, padding: "30px" }}>
          <Box sx={{ textAlign: "center", marginBottom: 2 }}>
            <Button
              onClick={() => handleOptionSelect("company")}
              sx={{
                m: 2,
                backgroundColor: selectedOption === "company" ? "#2E6B62" : "lavender",
                padding: 1,
                color: "black",
              }}
            >
              Company Login
            </Button>
            <Button
              onClick={() => handleOptionSelect("user")}
              sx={{
                m: 2,
                backgroundColor: selectedOption === "user" ? "#2E6B62" : "lavender",
                color: "black",
                padding: 1,
              }}
            >
              User Login
            </Button>
          </Box>

          {hasAccount ? (
            <>
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  src={image}
                  alt="Avatar"
                />
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  Upload Image
                </Typography>
                <input type="file" onChange={uploadImage} style={{ marginTop: 10 }} />

                {loading && (
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>{Math.round(percent)}% uploaded</Typography>
                  </Box>
                )}
              </Box>

              <TextField
                label="Name"
                fullWidth
                sx={{ marginY: 2 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                label="Email"
                type="email"
                fullWidth
                sx={{ marginY: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                sx={{ marginY: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />

              <Button
                variant="contained"
                sx={{ backgroundColor: "#4081ec", marginY: 2, width: "100%" }}
                onClick={SignUp}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Uploading..." : selectedOption === "company" ? "Company Sign Up" : "User Sign Up"}
              </Button>

              <Button
                variant="contained"
                sx={{ backgroundColor: "red", marginY: 2, width: "100%" }}
                onClick={GoogleSignIn}
              >
                {selectedOption === "company" ? "Sign Up with Google (Company)" : "Sign Up with Google (User)"}
              </Button>

              <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                Have an account?{" "}
                <Typography
                  component="span"
                  sx={{ color: "rgb(46,107,98)", cursor: "pointer" }}
                  onClick={() => setHasAccount(false)}
                >
                  Sign In
                </Typography>
              </Typography>
            </>
          ) : (
            <>
              <TextField
                label="Email"
                type="email"
                fullWidth
                sx={{ marginY: 2 }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                sx={{ marginY: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
              />

              <Button
                variant="contained"
                sx={{ backgroundColor: "rgb(46,107,98)", marginY: 2, width: "100%" }}
                onClick={signIn2}
              >
                {selectedOption === "company" ? "Company Sign In" : "User Sign In"}
              </Button>

              {selectedOption === "company" ? (
                <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                  Company account are handled differently
                  <Link to="/companyRegistration">
                    <Typography
                      component="span"
                      sx={{ color: "rgb(46,107,98)", cursor: "pointer", m: 2 }}
                    >
                      Click here to register
                    </Typography>
                  </Link>
                </Typography>
              ) : (
                <>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "tomato", marginY: 2, width: "100%" }}
                    onClick={GoogleSignIn}
                  >
                    Sign In with Google (User)
                  </Button>

                  <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                    Don't have an account?{" "}
                    <Typography
                      component="span"
                      sx={{ color: "rgb(46,107,98)", cursor: "pointer" }}
                      onClick={() => setHasAccount(true)}
                    >
                      Sign Up
                    </Typography>
                  </Typography>
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignPage;

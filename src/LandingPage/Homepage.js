import React from "react"
import {
    BrowserRouter as Router,
    Routes,
    Route,
  } from "react-router-dom"
import HeroSection from "./HeroSection"
import Header from "../components/Header"
import Products from "./Product"
import SomeProduct from "./SomeProduct"
import AboutPage from "./Aboutus"
import MissionPage from "./OurMission"
import WhatWeOfferPage from "./WhatWeOffer"
import SomeProductsPage from "./SomeProduct"

// import About from "./About"
// import HeroSection from "./HeroSection"


const HomePage = ()=>{
    return(
        <div>
           
            <div> <HeroSection/> </div>
            <div> <AboutPage/> </div>
            <div> <SomeProductsPage/> </div>
            <div> <MissionPage/> </div>
            <div> <WhatWeOfferPage/> </div>

        </div>
    )
}

export default HomePage
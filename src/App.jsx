import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import { Button } from "@/components/ui/button"
import { Footer } from "./components/Footer";
import ArticleSection from "./components/ArticleSection"; 
import { Input } from "@/components/ui/input"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

 <NavBar />
 <HeroSection />
 <Input />
 <ArticleSection />
 <Footer />
 
    </>
  )
}

export default App

"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Login from "@/components/Login";
import SignUp from "@/components/Signup";

export default function Home() {
  const images = [
    "/images/gym1.png",
    "/images/gym2.png",
    "/images/gym3.png",
    "/images/gym4.png",
    "/images/gym5.png",
  ];

  const [index, setIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      {/* רקע מתחלף */}
      <div className="slider-container">
        <AnimatePresence>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="slide"
          >
            <Image
              src={images[index]}
              alt={`gym image ${index + 1}`}
              fill
              className="slide-image"
            />
            <div className="overlay"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* לוגו */}
      <div className="logo-section">
        <Image src="/images/logo.png" alt="FitFinder Logo" width={100} height={100} />
      </div>

      {/* כפתורים */}
      <div className="buttons-section">
        <button className="btn-yellow" onClick={() => setShowSignUp(true)}>
          sign up
        </button>
        <button className="btn-yellow" onClick={() => setShowLogin(true)}>
          log in
        </button>
      </div>

      {/* חלונות קופצים */}
      <AnimatePresence>
        {showLogin && <Login onClose={() => setShowLogin(false)} />}
        {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
      </AnimatePresence>
    </div>
  );
}

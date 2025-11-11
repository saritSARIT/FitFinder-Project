"use client";
import { motion } from "framer-motion";

export default function SignUp({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="side-modal"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6 }}
    >
      <div className="modal-header">
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <form className="modal-form">
        <label>שם מלא</label>
        <input type="text" placeholder="הקלד/י שם מלא" />

        <label>אימייל</label>
        <input type="email" placeholder="example@gmail.com" />

        <label>סיסמה</label>
        <input type="password" placeholder="••••••" />

        <label>טלפון</label>
        <input type="tel" placeholder="050-1234567" />

        <button type="submit" className="btn-submit">הירשם</button>
      </form>
    </motion.div>
  );
}

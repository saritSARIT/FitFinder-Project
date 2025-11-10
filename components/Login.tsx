"use client";
import { motion } from "framer-motion";

export default function Login({ onClose }: { onClose: () => void }) {
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
        <label>אימייל</label>
        <input type="email" placeholder="example@gmail.com" />

        <label>סיסמה</label>
        <input type="password" placeholder="••••••" />

        <button type="submit" className="btn-submit">התחבר</button>
      </form>
    </motion.div>
  );
}

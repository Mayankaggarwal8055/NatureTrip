// src/components/PlaneCursor.jsx
import React, { useEffect, useRef } from "react";
import planeImg from "../assets/plane-icon.webp";

const PlaneCursor = () => {
  const planeRef = useRef(null);

  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let rafId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }
    };

    const updatePosition = () => {
      if (planeRef.current) {
        planeRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      rafId = null;
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={planeRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "23px",
        height: "23px",
        pointerEvents: "none",
        backgroundImage: `url(${planeImg})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export default PlaneCursor;

import { motion, useReducedMotion } from "framer-motion";

export default function PageTransition({ children }) {
  const reduceMotion = useReducedMotion();

  const variants = {
    initial: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 12, scale: 0.99 },

    animate: reduceMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, scale: 1 },

    exit: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -10, scale: 0.99 },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1], // smooth “spring-like” easing
      }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}
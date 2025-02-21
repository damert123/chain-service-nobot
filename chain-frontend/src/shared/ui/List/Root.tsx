import { Children } from "react";
import { cn } from "@/shared/lib";
import { motion, AnimatePresence } from "framer-motion";

interface RootProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Root({ children, className }: RootProps) {
  return (
    <motion.ul layout className={cn("", className)}>
      <AnimatePresence initial={false}>
        {Children.map(children, (child) => (
          <motion.li
            className="block"
            // @ts-expect-error lazy... sry
            key={child.key}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {child}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}

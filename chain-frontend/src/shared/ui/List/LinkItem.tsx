import { cn } from "@/shared/lib";

import Button from "@mui/material/Button";
import { Link } from "@tanstack/react-router";

interface LinkItemProps {
  children?: React.ReactNode;
  to: string;
  isSelected?: boolean;
}

export default function LinkItem({
  children,
  to,
  isSelected = false,
}: LinkItemProps) {
  return (
    <Link to={to}>
      <Button
        variant={isSelected ? "contained" : "text"}
        sx={{
          width: "100%",
          justifyContent: "start",
          textTransform: "none",
          fontWeight: "semibold",
          color: isSelected ? "white" : "#9B99B0",
          borderRadius: "6px",
          boxShadow: "none",
          paddingInline: "16px",
          ":hover": {
            boxShadow: "none",
          },
        }}
      >
        <span
          className={cn(
            "mr-2 max-h-2 min-h-2 min-w-2 max-w-2 rounded-full bg-neutral",
            isSelected && "bg-white",
          )}
        />
        <span>{children}</span>
      </Button>
    </Link>
  );
}

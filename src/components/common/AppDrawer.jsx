import React from "react";
import { Drawer } from "@mui/material";

/**
 * 공통 드로어(Drawer) 래퍼 컴포넌트
 * - anchor: "right" (기본 우측 슬라이드 패널) | "bottom" (하단 바텀시트)
 * - size: "sm" | "md" | "lg" | "xl" (anchor="right"일 때 최대 너비)
 */
const WIDTH_MAP = {
  sm: "420px",
  md: "540px",
  lg: "680px",
  xl: "920px",
};

const AppDrawer = ({
  open,
  onClose,
  anchor = "right",
  size = "md",
  children,
}) => {
  const isBottom = anchor === "bottom";
  const maxWidth = WIDTH_MAP[size] || WIDTH_MAP.md;

  return (
    <Drawer
      anchor={anchor}
      open={Boolean(open)}
      onClose={onClose}
      PaperProps={{
        sx: isBottom
          ? {
              backgroundColor: "transparent",
              boxShadow: "none",
              backgroundImage: "none",
              width: "100%",
              maxHeight: "90vh",
            }
          : {
              backgroundColor: "#141414",
              color: "#ffffff",
              backgroundImage: "none",
              width: "100%",
              maxWidth,
              borderLeft: "1px solid #262626",
              boxShadow: "-20px 0 50px rgba(0, 0, 0, 0.75)",
            },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.72)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      {children}
    </Drawer>
  );
};

export default AppDrawer;


import React from "react";
import { Drawer, useMediaQuery } from "@mui/material";

/**
 * 반응형 공통 드로어(Drawer) 컴포넌트
 * - 모바일 (< 768px): 화면 하단에서 올라오는 바텀시트 (anchor="bottom")
 * - PC (>= 768px): 화면 우측에서 슬라이드되는 사이드 패널 (anchor="right")
 * - size: "sm" | "md" | "lg" | "xl" (PC 우측 드로어 너비 및 모바일 최대 높이 결정)
 */
const WIDTH_MAP = {
  sm: "400px",
  md: "540px",
  lg: "680px",
  xl: "920px",
};

const AppDrawer = ({
  open,
  onClose,
  anchor = "responsive",
  size = "md",
  children,
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const effectiveAnchor =
    anchor === "responsive" ? (isMobile ? "bottom" : "right") : anchor;
  const isBottom = effectiveAnchor === "bottom";
  const maxWidth = WIDTH_MAP[size] || WIDTH_MAP.md;

  return (
    <Drawer
      anchor={effectiveAnchor}
      open={Boolean(open)}
      onClose={onClose}
      PaperProps={{
        sx: isBottom
          ? {
              backgroundColor: "#141414",
              color: "#ffffff",
              backgroundImage: "none",
              width: "100%",
              maxHeight: size === "xl" ? "92vh" : "88vh",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              borderTop: "1px solid #262626",
              boxShadow: "0 -20px 50px rgba(0, 0, 0, 0.85)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }
          : {
              backgroundColor: "#141414",
              color: "#ffffff",
              backgroundImage: "none",
              width: "100%",
              maxWidth,
              height: "100%",
              borderLeft: "1px solid #262626",
              boxShadow: "-20px 0 50px rgba(0, 0, 0, 0.75)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
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
      {/* 모바일 바텀시트 상단 핸들 바 */}
      {isBottom && (
        <div
          onClick={onClose}
          className="w-full pt-3 pb-1 bg-[#141414] flex justify-center items-center shrink-0 cursor-pointer"
        >
          <div className="w-11 h-1.5 rounded-full bg-neutral-700" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        {children}
      </div>
    </Drawer>
  );
};

export default AppDrawer;

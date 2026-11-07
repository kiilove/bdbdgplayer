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
              backgroundColor: "#ffffff",
              color: "#111111",
              backgroundImage: "none",
              width: "100%",
              maxHeight: size === "xl" ? "92vh" : "88vh",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              borderTop: "1px solid #e5e5ea",
              boxShadow: "0 -12px 40px rgba(0, 0, 0, 0.14)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }
          : {
              backgroundColor: "#ffffff",
              color: "#111111",
              backgroundImage: "none",
              width: "100%",
              maxWidth,
              height: "100%",
              borderLeft: "1px solid #e5e5ea",
              boxShadow: "-12px 0 40px rgba(0, 0, 0, 0.12)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(17, 17, 17, 0.45)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      {/* 모바일 바텀시트 상단 핸들 바 */}
      {isBottom && (
        <div
          onClick={onClose}
          className="w-full pt-3 pb-1.5 bg-white flex justify-center items-center shrink-0 cursor-pointer"
        >
          <div className="w-10 h-1.5 rounded-full bg-neutral-300" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        {children}
      </div>
    </Drawer>
  );
};

export default AppDrawer;

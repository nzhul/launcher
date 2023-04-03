import Button from "@mui/material/Button";

const NavButton: React.FC<{ title: string; onClick: () => void; sx?: any }> = ({
  title,
  onClick,
  sx,
}) => {
  return (
    <Button
      onClick={onClick}
      disableRipple
      sx={{
        WebkitAppRegion: "no-drag",
        color: "white",
        borderRight: "2px solid #3D3D3D",
        borderRadius: 0,
        transform: "skewX(-8deg)",
        height: "60px",
        boxShadow: "none",
        fontWeight: 300,
        pl: 4,
        pr: 4,
        "&:hover": {
          boxShadow: "inset 0 0 100px 100px rgba(255, 255, 255, 0.2)",
        },
        "&:active": {
          boxShadow: "inset 0 0 100px 100px rgba(255, 255, 255, 0.3)",
        },
        "&:active span": {
          position: "relative",
          top: "1px",
        },
        mt: "-5px",
        ...sx,
      }}
    >
      <span
        style={{
          transform: "skewX(8deg)",
        }}
      >
        {title}
      </span>
    </Button>
  );
};

export default NavButton;

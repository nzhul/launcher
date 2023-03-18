import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { InstallationState } from "../../../models/InstallationState";

const DownloadIndicator: React.FC<{
  progressPercent: number;
  installationState: InstallationState;
  remainingMb: number;
  totalMb: number;
  speed: string;
  onPause: () => void;
  onResume: () => void;
}> = ({
  progressPercent,
  installationState,
  remainingMb,
  totalMb,
  speed,
  onPause,
  onResume,
}) => {
  return (
    <>
      <Box
        sx={{
          width: 300,
          height: 40,
          display: "flex",
          alignItems: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            mr: 2,
            height: 10,
            borderRadius: 10,
            width: "100%",
            backgroundColor: "#707070",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#D9D9D9",
            },
          }}
        />
        <Box>{progressPercent.toFixed(2)}%</Box>

        {installationState == InstallationState.Paused && (
          <IconButton
            sx={{
              color: "rgba(255,255,255,0.5)",
              backgroundColor: "none",
              "&:hover": {
                color: "white",
              },
            }}
            onClick={onResume}
          >
            <PlayArrow />
          </IconButton>
        )}

        {installationState == InstallationState.Downloading && (
          <IconButton
            sx={{
              color: "rgba(255,255,255,0.5)",
              backgroundColor: "none",
              "&:hover": {
                color: "white",
              },
            }}
            onClick={onPause}
          >
            <Pause />
          </IconButton>
        )}
      </Box>

      <Typography
        variant="body1"
        component="div"
        sx={{ mt: -1, fontSize: "14px" }}
      >
        <span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>
            {remainingMb.toFixed(0)}{" "}
          </span>
          <span style={{ color: "#909090" }}>/ {totalMb.toFixed(0)} Mb @ </span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{speed}</span>{" "}
          <span style={{ color: "#909090" }}>Mb/s</span>
        </span>
      </Typography>
    </>
  );
};

export default DownloadIndicator;

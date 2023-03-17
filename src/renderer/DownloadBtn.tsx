import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DownloadState } from "../../src/models/downloadState";
import Typography from "@mui/material/Typography";
import Settings from "@mui/icons-material/Settings";

const DownloadBtn = () => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [speed, setSpeed] = useState<string>("0");
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);
  const [downloadComplete, setDownloadComplete] = useState<boolean>(false);
  const [totalMB, setTotalMB] = useState<number>(0);
  const [remainingMB, setRemainingMB] = useState<number>(0);

  const startDownload = async (resume?: boolean) => {
    try {
      console.log("Download Start");

      setDownloadStarted(true);
      setDownloading(true);

      await window.API.downloadFile(
        // "https://github.com/nzhul/tic-tac-toe-online/releases/download/v15/build-StandaloneWindows64-v15.zip",
        // "https://github.com/microsoft/AzureStorageExplorer/archive/refs/tags/v1.28.1.zip",
        // "https://izotcomputers.com/katalog/web/files/katalog.pdf",
        "https://izotcomputers.com/team/videos/11_runuta_prai_borbata.mp4",
        // "https://research.nhm.org/pdfs/10840/10840.pdf",
        resume
      );

      // await window.API.downloadFile(
      //   "https://izotcomputers.com/team/videos/11_runuta_prai_borbata.mp4",
      //   resume
      // );

      setDownloading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const pauseDownload = async () => {
    console.log("Pausing");
    window.API.downloadPause();
    setPaused(true);
  };

  const resumeDownload = async () => {
    console.log("Resuming");
    startDownload(true);
    setPaused(false);
  };

  const checkState = async () => {
    try {
      const state = await window.API.getState();
      if (state) {
        setProgressPercent(state.progress);
        setPaused(true);
        setDownloadStarted(true);

        const mb = (state.totalBytes - state.downloadedBytes) / (1024 * 1024);
        setRemainingMB(mb);
      }
    } catch (error) {
      console.log("no pause file");
    }
  };

  const handleDownloadProgress = (status: DownloadState) => {
    setProgressPercent(status.progress);

    const speedString = status.speed.toFixed(2);
    setSpeed(speedString);

    const remainingMB =
      (status.totalBytes - status.downloadedBytes) / (1024 * 1024);
    setRemainingMB(remainingMB);

    if (totalMB != 0) return;
    const mb = status.totalBytes / (1024 * 1024);
    setTotalMB(mb);
  };

  const handleDownloadComplete = (path: string) => {
    console.log("Complete: " + path);
    setDownloadComplete(true);
    setDownloadStarted(false);
  };

  const resolveLabel = () => {
    let label = "INSTALL";

    if (downloadStarted && paused) {
      label = "PAUSED";
    }

    if (downloadStarted && !paused) {
      label = "DOWNLOADING";
    }

    return label;
  };

  useEffect(() => {
    checkState();
    window.API.onDownloadProgress(handleDownloadProgress);
    window.API.onDownloadComplete(handleDownloadComplete);
    return () => {
      window.API.removeListener();
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        width: "300px",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={() => {
            startDownload();
          }}
          variant="contained"
          disabled={downloadStarted} // TODO: Listen for download-completed event!
          sx={{
            width: "100%",
            height: "70px",
            fontSize: 24,
            letterSpacing: 3,
            borderRadius: "5px 0px 0px 5px",
          }}
        >
          {resolveLabel()}
        </Button>
        <Button
          variant="contained"
          sx={{
            borderRadius: "0px 5px 5px 0px",
            ml: "2px",
            minWidth: "45px",
            width: "45px",
            padding: 0,
            "&:hover > .settingsIcon": {
              transform: "rotate(90deg)",
            },
          }}
        >
          <Settings
            className="settingsIcon"
            sx={{
              transition: "transform 0.2s ease-out",
              width: 30,
              height: 30,
            }}
          />
        </Button>
      </Box>

      <Box
        sx={{ width: 300, height: 40, display: "flex", alignItems: "center" }}
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
        <Box>{progressPercent.toFixed(2)}&nbsp;%</Box>

        {paused && (
          <IconButton
            sx={{
              color: "rgba(255,255,255,0.5)",
              backgroundColor: "none",
              "&:hover": {
                color: "white",
              },
            }}
            onClick={() => {
              resumeDownload();
            }}
          >
            <PlayArrow />
          </IconButton>
        )}

        {!paused && downloading && (
          <IconButton
            sx={{
              color: "rgba(255,255,255,0.5)",
              backgroundColor: "none",
              "&:hover": {
                color: "white",
              },
            }}
            onClick={() => {
              pauseDownload();
            }}
            disabled={!downloading}
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
            {remainingMB.toFixed(0)}{" "}
          </span>
          <span style={{ color: "#909090" }}>/ {totalMB.toFixed(0)} Mb @ </span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{speed}</span>{" "}
          <span style={{ color: "#909090" }}>Mb/s</span>
        </span>
      </Typography>
    </Box>
  );
};

export default DownloadBtn;

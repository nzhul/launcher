import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";

const DownloadBtn = () => {
  const [downloading, setDownloading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const startDownload = async () => {
    try {
      console.log("Download Start");

      setDownloading(true);

      await window.API.downloadFile(
        "https://izotcomputers.com/team/videos/11_runuta_prai_borbata.mp4"
      );

      setDownloading(false);

      console.log("Download Complete");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadProgress = (progress: number) => {
    const percentage = Math.round(progress * 100 * 1e2) / 1e2;
    setProgressPercent(percentage);
  };

  const pauseDownload = async () => {
    console.log("Pausing");
    setPaused(true);
  };

  const resumeDownload = async () => {
    console.log("Resuming");
    setPaused(false);
  };

  useEffect(() => {
    window.API.onDownloadProgress(handleDownloadProgress);
    return () => {
      window.API.removeListener();
    };
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          startDownload();
        }}
        variant="contained"
        disabled={downloading}
        sx={{ mr: 1 }}
      >
        <span>Download</span>
      </Button>

      {!paused && downloading && (
        <IconButton
          onClick={() => {
            pauseDownload();
          }}
          disabled={!downloading}
        >
          <Pause />
        </IconButton>
      )}

      {paused && (
        <IconButton
          onClick={() => {
            resumeDownload();
          }}
          disabled={!downloading}
        >
          <PlayArrow />
        </IconButton>
      )}
      <Grid container spacing={2} columns={{ xs: 6, md: 12 }}>
        <Grid item xs={10}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{ mt: 5 }}
          />
        </Grid>
        <Grid item xs={2}>
          {progressPercent} %
        </Grid>
      </Grid>
    </>
  );
};

export default DownloadBtn;

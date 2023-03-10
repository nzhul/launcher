import PlayArrow from "@mui/icons-material/PlayArrow";
import Pause from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DownloadState } from "../../src/models/downloadState";

const DownloadBtn = () => {
  const [state, setState] = useState<DownloadState | undefined>();
  const [downloading, setDownloading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [speed, setSpeed] = useState<string>();

  const startDownload = async (resume?: boolean) => {
    try {
      console.log("Download Start");

      setDownloading(true);

      await window.API.downloadFile(
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

  const handleDownloadProgress = (status: {
    progress: number;
    speed: number;
  }) => {
    setProgressPercent(status.progress);

    const speedString = status.speed.toFixed(2);
    setSpeed(speedString);
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
        setState(state);
        setProgressPercent(state.progress);
        setPaused(true);
      }
    } catch (error) {
      console.log("no pause file");
    }
  };

  useEffect(() => {
    checkState();
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
        disabled={downloading} // TODO: Listen for download-completed event!
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
        >
          <PlayArrow />
        </IconButton>
      )}

      <Grid container spacing={2} columns={{ xs: 6, md: 12 }} sx={{ mt: 1 }}>
        <Grid item xs={12} alignContent={"center"} textAlign={"center"}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              mr: 10,
              height: 10,
              borderRadius: 10,
              position: "relative",
            }}
          />
          <Box sx={{ float: "right", position: "relative", top: -17, left: 0 }}>
            {progressPercent.toFixed(2)} %
          </Box>
        </Grid>
      </Grid>
      <Grid container columns={{ xs: 6, md: 12 }}>
        <Grid item xs={6}>
          Speed: {speed} Mb/s
        </Grid>
      </Grid>
    </>
  );
};

export default DownloadBtn;

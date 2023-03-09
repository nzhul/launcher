import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";

const DownloadBtn = () => {
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const startDownload = async () => {
    try {
      console.log("Download Start");

      // await window.API.downloadFile(
      //   "https://images.freeimages.com/images/large-previews/d41/bear-combat-2-1332988.jpg"
      // );

      await window.API.downloadFile(
        "https://izotcomputers.com/team/videos/11_runuta_prai_borbata.mp4"
      );

      console.log("Download Complete");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownloadProgress = (progress: number) => {
    const percentage = Math.round(progress * 100 * 1e2) / 1e2;
    setProgressPercent(percentage);
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
      >
        <span>Download</span>
      </Button>
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

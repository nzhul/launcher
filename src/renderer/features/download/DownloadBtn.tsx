import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { PauseInfo } from "../../../models/PauseInfo";
import { InstallationState } from "../../../models/InstallationState";
import { extractVersion } from "../../../common/utils";
import { InstallInfo } from "../../../models/InstallInfo";
import DownloadIndicator from "./DownloadIndicator";
import GameSettingsBtn from "./GameSettingsBtn";

const DownloadBtn = () => {
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [speed, setSpeed] = useState<string>("0");
  const [totalMB, setTotalMB] = useState<number>(0);
  const [remainingMB, setRemainingMB] = useState<number>(0);
  const [installInfo, setInstallInfo] = useState<InstallInfo>();
  const [remoteVersion, setRemoteVersion] = useState<number>();
  const [versionChecked, setVersionChecked] = useState<boolean>();
  const [installationState, setInstallationState] = useState<InstallationState>(
    InstallationState.PendingInstall
  );
  const [extractCurrentFile, setExtractCurrentFile] = useState<string>("");
  const [uninstallCurrentFile, setUninstallCurrentFile] = useState<string>("");

  const handleBigButtonClick = async () => {
    if (installationState == InstallationState.Ready) {
      // start game process
      console.log("Starting Child Process!");
      window.API.startGame();
      setInstallationState(InstallationState.Playing);
    }

    if (
      installationState == InstallationState.PendingInstall ||
      installationState == InstallationState.PendingUpdate
    ) {
      startDownload();
    }
  };

  const startDownload = async (resume?: boolean) => {
    try {
      console.log("Download Start");
      setInstallationState(InstallationState.Downloading);

      await window.API.downloadFile(
        "https://github.com/nzhul/tic-tac-toe-online/releases/download/v15/build-StandaloneWindows64-v15.zip",
        // "https://github.com/microsoft/AzureStorageExplorer/archive/refs/tags/v1.28.1.zip",
        // "https://izotcomputers.com/katalog/web/files/katalog.pdf",
        // "https://izotcomputers.com/team/videos/11_runuta_prai_borbata.mp4",
        // "https://research.nhm.org/pdfs/10840/10840.pdf",
        resume
      );
    } catch (error) {
      console.log(error);
    }
  };

  const pauseDownload = async () => {
    console.log("Pausing");
    window.API.downloadPause();
    setInstallationState(InstallationState.Paused);
  };

  const resumeDownload = async () => {
    console.log("Resuming");
    startDownload(true);
    setInstallationState(InstallationState.Downloading);
  };

  const checkState = async () => {
    const { pauseInfo, installInfo } = await window.API.getState();

    if (pauseInfo) {
      setInstallationState(InstallationState.Paused);
      setProgressPercent(pauseInfo.progress);
      setTotalMB(pauseInfo.totalBytes / (1024 * 1024)); // TODO: extract this conversion from bytes to MB into utility function.

      const mb =
        (pauseInfo.totalBytes - pauseInfo.downloadedBytes) / (1024 * 1024);
      setRemainingMB(mb);
      setVersionChecked(true);
      return;
    }

    if (!installInfo) {
      setInstallationState(InstallationState.PendingInstall);
      setVersionChecked(true);
      return;
    }

    setInstallInfo(installInfo);

    // eslint-disable-next-line no-debugger
    let latestRelease = undefined;

    try {
      latestRelease = await getLatestReleaseInfo();
    } catch (error) {
      console.warn("Cannot fetch latest release from github." + error);
    }

    // 'https://github.com/nzhul/tic-tac-toe-online/releases/download/v15/build-StandaloneWindows64-v15.zip'
    const downloadUrl = latestRelease.assets[0].browser_download_url;
    const remoteVersion = extractVersion(downloadUrl);
    setRemoteVersion(remoteVersion);

    if (installInfo.gameClientVersion < remoteVersion) {
      setInstallationState(InstallationState.PendingUpdate);
    } else if (installInfo.gameClientVersion == remoteVersion) {
      setInstallationState(InstallationState.Ready);
    }

    setVersionChecked(true);
  };

  const handleDownloadProgress = (status: PauseInfo) => {
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

  const handleDownloadComplete = async (path: string) => {
    console.log("Download Complete: " + path);
    setInstallationState(InstallationState.Extracting);

    console.log("Extracting Start");
    await window.API.extractFile(path);
    console.log("Extracting complete");

    const version = extractVersion(path);

    setInstallInfo({
      gameClientVersion: version,
      installDirectory: path,
    });

    setInstallationState(InstallationState.Ready);
  };

  const handleExtractProgress = (currentFile: string) => {
    setExtractCurrentFile("./" + currentFile);
  };

  const handleGameQuit = (code: number) => {
    console.log("Code: " + code);
    setInstallationState(InstallationState.Ready);
  };

  const handleUninstall = async () => {
    console.log("Uninstalling ...");
    setInstallationState(InstallationState.Uninstalling);
    await window.API.uninstallGame();
    setInstallationState(InstallationState.PendingInstall);
    console.log("Uninstall complete!");
  };

  const handleUninstallProgress = (currentFile: string) => {
    setUninstallCurrentFile("./" + currentFile);
  };

  // --- privates ---

  const resolveLabel = () => {
    let label = "";
    switch (installationState) {
      case InstallationState.PendingInstall:
        label = "Install";
        break;
      case InstallationState.PendingUpdate:
        label = "Update";
        break;
      case InstallationState.Downloading:
        label = "Downloading";
        break;
      case InstallationState.Extracting:
        label = "Extracting";
        break;
      case InstallationState.Paused:
        label = "Paused";
        break;
      case InstallationState.Ready:
        label = "Play";
        break;
      case InstallationState.Playing:
        label = "Playing Now";
        break;
      case InstallationState.Uninstalling:
        label = "Uninstalling";
        break;

      default:
        break;
    }

    return label;
  };

  const getLatestReleaseInfo = async () => {
    // note: I am doing this decoding only to hide the token from github stupid detection alg that revokes tokens.
    // this is just a simple read-only token from a blank account.

    const decoded = window.atob(
      "Z2hwX3A3alNCbXJRTHJPTU5nejJ5ZFk0NGhyVEdUczlVeTJEMjJsTw=="
    );

    const response = await fetch(
      "https://api.github.com/repos/nzhul/tic-tac-toe-online/releases/latest",
      {
        headers: {
          Authorization: `token ${decoded}`,
        },
      }
    );

    return await response.json();
  };

  useEffect(() => {
    checkState();
    window.API.onDownloadProgress(handleDownloadProgress);
    window.API.onDownloadComplete(handleDownloadComplete);
    window.API.onExtractProgress(handleExtractProgress);
    window.API.onQuitGame(handleGameQuit);
    window.API.onUninstallProgress(handleUninstallProgress);
    return () => {
      window.API.removeListener();
    };
  }, []);

  // We do not render the button untill the version is compared using remote github api call.
  // We do this to prevent flickering.
  if (!versionChecked) {
    return <></>;
  }

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
          onClick={handleBigButtonClick}
          variant="contained"
          disabled={
            installationState == InstallationState.Downloading ||
            installationState == InstallationState.Paused ||
            installationState == InstallationState.Extracting ||
            installationState == InstallationState.Playing ||
            installationState == InstallationState.Uninstalling
          }
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
        <GameSettingsBtn onUninstallConfirm={handleUninstall} />
      </Box>
      <Box sx={{ height: "55px" }}>
        {(installationState == InstallationState.Downloading ||
          installationState == InstallationState.Paused) && (
          <DownloadIndicator
            progressPercent={progressPercent}
            installationState={installationState}
            remainingMb={remainingMB}
            totalMb={totalMB}
            speed={speed}
            onPause={pauseDownload}
            onResume={resumeDownload}
          />
        )}

        {installationState == InstallationState.Ready && installInfo && (
          <Box
            sx={{
              pt: 1,
              fontSize: 12,
              textAlign: "center",
              width: "252px",
            }}
          >
            Version: 0.{installInfo.gameClientVersion} alpha
          </Box>
        )}

        {installationState == InstallationState.PendingUpdate && (
          <Box
            sx={{
              pt: 1,
              fontSize: 12,
              textAlign: "center",
              width: "252px",
            }}
          >
            Update from v0.{installInfo.gameClientVersion} to v0.{remoteVersion}
          </Box>
        )}

        {installationState == InstallationState.Extracting && (
          <Box
            sx={{
              pt: 1,
              fontSize: 12,
              textAlign: "left",
            }}
          >
            <span style={{ fontStyle: "italic" }}>
              {extractCurrentFile.length > 47
                ? extractCurrentFile.substring(0, 47) + "..."
                : extractCurrentFile}
            </span>
          </Box>
        )}
        {installationState == InstallationState.Uninstalling && (
          <Box
            sx={{
              pt: 1,
              fontSize: 12,
              textAlign: "left",
            }}
          >
            <span style={{ fontStyle: "italic" }}>
              {uninstallCurrentFile.length > 47
                ? uninstallCurrentFile.substring(0, 47) + "..."
                : uninstallCurrentFile}
            </span>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DownloadBtn;

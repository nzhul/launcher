import Settings from "@mui/icons-material/Settings";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import ConfirmDialog from "../../common/ConfirmDialog";

const GameSettingsBtn: React.FC<{ onUninstallConfirm: () => void }> = ({
  onUninstallConfirm,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [uninstallOpened, setUninstallOpened] = useState<boolean>(false);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleUninstallClose = () => {
    setUninstallOpened(false);
  };

  // ---- Menu Item handlers
  const handleGameSettingsBtnClick = () => {
    console.log("Opening game settings dialog!");
  };

  const handleUninstallBtnClick = () => {
    setAnchorEl(null);
    setUninstallOpened(true);
  };

  return (
    <>
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
        onClick={handleSettingsClick}
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
      <Menu
        id="game-settings-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{ mt: -10, ml: -1 }}
      >
        <MenuItem onClick={handleGameSettingsBtnClick}>Game Settings</MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            window.API.revealInExplorer();
          }}
        >
          Reveal in Explorer
        </MenuItem>
        <MenuItem>Check for Updates</MenuItem>
        <MenuItem onClick={handleUninstallBtnClick}>Uninstall</MenuItem>
      </Menu>
      <ConfirmDialog
        title="Uninstall"
        description="Are you sure you want to uninstall Ancient Warriors and remove all files?"
        open={uninstallOpened}
        onClose={handleUninstallClose}
        onConfirm={() => {
          setUninstallOpened(false);
          onUninstallConfirm();
        }}
      />
    </>
  );
};

export default GameSettingsBtn;

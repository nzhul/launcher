import Archive from "@mui/icons-material/Archive";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
} from "@mui/material";
import { useState } from "react";

const InstallDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  const [directory, setDirectory] = useState<string | undefined>();

  const loadDefault = async () => {
    return await window.API.getDefaultDirectory();
  };

  if (open && !directory) {
    loadDefault().then((dir) => {
      setDirectory(dir);
    });
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={() => {
        setDirectory(undefined);
        onClose();
      }}
      PaperProps={{ sx: { border: "1px solid #5E5E5E" } }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid #5E5E5E" }}>
        Installing Ancient Warriors
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}
          sx={{ mt: 1, mb: 1 }}
        >
          <Grid item xs={8}>
            <Typography variant="caption" component="p">
              INSTALL DIRECTORY
            </Typography>
            <Typography variant="body2" component="p" sx={{ color: "#979797" }}>
              {!directory && "[Please select]"}
              {directory && `${directory}\\Ancient Warriors\\`}
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignContent: "flex-end",
            }}
          >
            <Button
              variant="text"
              sx={{ mr: -1 }}
              onClick={async () => {
                const dir = await window.API.selectDirectory();
                if (dir) {
                  setDirectory(dir[0]);
                }
              }}
            >
              Change Directory
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Auto-Update"
              />
              <FormControlLabel
                disabled
                control={<Checkbox />}
                label="Create Desktop Shortcut"
                sx={{ mt: -1 }}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          pr: 2,
          pb: 2,
          pt: 2,
          borderTop: "1px solid #5E5E5E",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ textAlign: "left", ml: 1.7 }}>
          <Archive sx={{ mr: 1, color: "#E5DE33" }} />
          <Box
            sx={{ display: "inline-block", position: "relative", top: "-5px" }}
          >
            75 MB <span style={{ color: "#8C8C8C" }}>required</span>
          </Box>
        </Box>
        <Box>
          <Button
            onClick={onClose}
            variant="contained"
            color="info"
            sx={{ mr: 1.5 }}
          >
            Cancel
          </Button>

          <Button
            disabled={!directory}
            sx={{
              transition: "transform 0.2s ease-out",
            }}
            variant="contained"
            //   color="error"
            onClick={() => {
              setDirectory(undefined);
              onConfirm();
            }}
          >
            Start Install
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InstallDialog;

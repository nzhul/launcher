import Settings from '@mui/icons-material/Settings';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useState } from 'react';
import AuthContext from '../../context/AuthContext';

const ProfileSettingsBtn = () => {
  const { logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        sx={{
          position: 'relative',
          float: 'right',
          mt: '6px',
          color: 'rgba(255,255,255,0.5)',
          backgroundColor: 'none',
          '&:hover': {
            color: 'white',
          },
        }}
        onClick={handleSettingsClick}
      >
        <Settings sx={{ fontSize: 30 }} />
      </IconButton>
      <Menu
        id="game-settings-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        sx={{ mt: 6, ml: -1 }}
      >
        <MenuItem>View Profile</MenuItem>
        <MenuItem>View Account</MenuItem>
        <Divider />
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileSettingsBtn;

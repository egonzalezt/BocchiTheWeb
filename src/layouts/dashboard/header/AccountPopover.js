import { useState } from 'react';
import { Link } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
import useUserStore from '../../../stateStore/zustand';

const MENU_OPTIONS = [
  {
    label: 'Archivos',
    icon: 'eva:person-fill',
    destination: '/dashboard/files'
  },
  {
    label: 'Solicitudes',
    icon: 'eva:settings-2-fill',
    destination: '/dashboard/requests'
  },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const user = useUserStore((state) => state.user);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={"/assets/images/avatars/avatar_default.png"} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user.name}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <Link key={option.label} to={option.destination} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClose}>
              <MenuItem>
                {option.label}
              </MenuItem>
            </Link>
          ))}
        </Stack>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleLogout}>
          <MenuItem sx={{ m: 1 }}>
            Cerrar de sesión
          </MenuItem>
        </Link>
      </Popover>
    </>
  );
}

import {Box, IconButton, useTheme}  from '@mui/material';
import { useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import '../admin.css';
import { ColorModeContext,tokens } from "../../../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {useUser} from '../../User/UserContext';


const Topbar = () => {
    const theme= useTheme();
    const colors=tokens(theme.palette.mode);
    const colorMode=useContext(ColorModeContext);
    const { setUser } = useUser();
    const navigate = useNavigate(); 

    const handleLogout = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
      setUser(null);
      navigate('/');
  };

    return (<Box display="flex" justifyContent="right" p={1} >
        <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "light" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
          </IconButton>
            <IconButton onClick={() => { handleLogout() }}>
                <PersonOutlinedIcon />
            </IconButton>
        </Box>
    </Box>)
}

export default Topbar;
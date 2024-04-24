import Header from "../Header";
import '../admin.css';
import { useUser } from "../../User/UserContext";
import { Box } from "@mui/material";

const Dashboard = () => {
  const {user} = useUser();

    return <Box m="20px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="Acasă" subtitle={`Bine ai venit, ${user ? user.prenume + ' ' + user.nume : 'user'}!`}/>
      </Box>
    </Box>
}

export default Dashboard;
import Header from "../Header";
import '../admin.css';
import { Box } from "@mui/material";

const Dashboard = () => {
    return <Box m="20px">
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Header title="Acasă" subtitle="Bine ai venit, admin!" />
      </Box>
    </Box>
}

export default Dashboard;
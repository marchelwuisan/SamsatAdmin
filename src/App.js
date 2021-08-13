import 'react-perfect-scrollbar/dist/css/styles.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import theme from 'src/theme';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Users from 'src/pages/Users';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import { useSelector } from "react-redux";

const App = () => {
  let loggedIn = useSelector(state => state.loggedIn);


  return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="login" element={<Login />} />
            {/* <Route path="404" element={<NotFound />} /> */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
          <Route path="app" element={<DashboardLayout />}>
            <Route path="users" element={loggedIn == true ? <Users /> : <Navigate to ="/login"/>} />
            <Route path="vehicles" element={loggedIn == true ? <Dashboard /> : <Navigate to ="/login"/>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </ThemeProvider>
  );
};

export default App;

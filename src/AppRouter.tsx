import { Link as LinkD, Route, Routes } from 'react-router-dom'
import { HomeScreen } from './presentation/home/HomeScreen'
import { LoginScreen } from './presentation/login/LoginScreen'
import { EmployeeRegister } from './presentation/register/RegisterScreen'
import { DashboardScreen } from './presentation/dashboard/DashboardScreen'
import ProductsDashboard from './presentation/dashboard/ProductsDashboard'
import SalesDashboard from './presentation/dashboard/SalesDashboard'
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { InventoryRounded } from '@mui/icons-material'
import ProductRegister from './presentation/register/ProductRegister'


const AppRouter = () => {

  return (
    <>
      {/* Barra de Navegación (Header) */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <ShoppingCartIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <LinkD to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Calzando a México
            </LinkD>
          </Typography>
          <Button color="inherit"> <LinkD to="/login"style={{ textDecoration: 'none', color: 'inherit' }}> Login </LinkD> </Button>
          <Button color="inherit"> <LinkD to="/sales" style={{ textDecoration: 'none', color: 'inherit' }}><ShoppingCartIcon /> Ventas</LinkD> </Button>
          <Button color="inherit">
            <LinkD to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <InventoryRounded /> Inventario
            </LinkD>
          </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path='/login' element={ <LoginScreen /> } />
        <Route path='/register' element={ <EmployeeRegister /> } />
        <Route path='/dashboard' element={ <DashboardScreen /> } />
        <Route path='/' element={ <ProductsDashboard /> } />
        <Route path='/registerProduct' element={ <ProductRegister /> } />
        <Route path='/sales' element={ <SalesDashboard /> } />
      </Routes>
    </>
  )
}

export default AppRouter

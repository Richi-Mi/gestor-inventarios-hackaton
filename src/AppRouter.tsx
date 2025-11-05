import { Route, Routes } from 'react-router-dom'
import { HomeScreen } from './presentation/home/HomeScreen'
import { LoginScreen } from './presentation/login/LoginScreen'
import { EmployeeRegister } from './presentation/register/RegisterScreen'
import { DashboardScreen } from './presentation/dashboard/DashboardScreen'


const AppRouter = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={ <HomeScreen /> } />
        <Route path='/login' element={ <LoginScreen /> } />
        <Route path='/register' element={ <EmployeeRegister /> } />
        <Route path='/dashboard' element={ <DashboardScreen /> } />
      </Routes>
    </>
  )
}

export default AppRouter

import { Route, Routes } from 'react-router-dom'
import { HomeScreen } from './presentation/home/HomeScreen'
import { LoginScreen } from './presentation/login/LoginScreen'
import { EmployeeRegister } from './presentation/register/RegisterScreen'


const AppRouter = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={ <HomeScreen /> } />
        <Route path='/login' element={ <LoginScreen /> } />
        <Route path='/register' element={ <EmployeeRegister /> } />
      </Routes>
    </>
  )
}

export default AppRouter

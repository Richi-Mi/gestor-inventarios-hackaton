import { Route, Routes } from 'react-router-dom'
import { HomeScreen } from './presentation/home/HomeScreen'


const AppRouter = () => {

  return (
    <>
      <Routes>
        <Route path='/' element={ <HomeScreen /> } />
      </Routes>
    </>
  )
}

export default AppRouter

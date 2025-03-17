import { BrowserRouter, Route, Routes } from 'react-router'
import { ROUTE_CONFIG } from '../constants/route'
import Login from '../pages/public/Login'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_CONFIG.LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

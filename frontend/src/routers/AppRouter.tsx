import Register from '../pages/public/Register'
import NoteList from '../pages/private/NoteList'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ROUTE_CONFIG } from '../constants/route'
import NotFound from '../pages/public/NotFound'
import Login from '../pages/public/Login'
import Private from '../guards/Private'
import Public from '../guards/Public'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Public />}>
          <Route path={ROUTE_CONFIG.LOGIN} element={<Login />} />
          <Route path={ROUTE_CONFIG.REGISTER} element={<Register />} />
        </Route>

        <Route element={<Private />}>
          <Route path={ROUTE_CONFIG.HOME} element={<NoteList />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

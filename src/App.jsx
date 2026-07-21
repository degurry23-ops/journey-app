import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CreateTrip from './pages/CreateTrip'
import JourneyList from './pages/JourneyList'
import TripDetail from './pages/TripDetail'
import DayTimeline from './pages/DayTimeline'
import MapPage from './pages/MapPage'
import Expenses from './pages/Expenses'
import Journal from './pages/Journal'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/journeys" element={<JourneyList />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/create" element={<CreateTrip />} />
      <Route path="/trip/:id" element={<TripDetail />} />
      <Route path="/trip/:id/day/:dayId" element={<DayTimeline />} />
      <Route path="/trip/:id/map" element={<MapPage />} />
      <Route path="/trip/:id/expenses" element={<Expenses />} />
      <Route path="/trip/:id/journal" element={<Journal />} />
    </Routes>
  )
}

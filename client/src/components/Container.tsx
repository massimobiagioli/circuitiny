import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Devices from './Devices'
const Container = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/devices" element={<Devices />} />
    </Routes>
  )
}
export default Container

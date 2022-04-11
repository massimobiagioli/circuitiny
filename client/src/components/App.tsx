import { Link } from 'react-router-dom'
import Container from './Container'
export default function App() {
  return (
    <>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/devices">Devices</Link>
          </li>
        </ul>
        <hr />
        <Container />
      </div>
    </>
  )
}

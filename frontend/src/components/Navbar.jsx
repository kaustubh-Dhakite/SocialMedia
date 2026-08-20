import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          SocialApp
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Feed
          </Link>
          <Link to="/explore" className="nav-link">
            Explore
          </Link>
          <Link to={`/profile/${user?.id}`} className="nav-link">
            Profile
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

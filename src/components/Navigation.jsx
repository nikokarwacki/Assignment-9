import { Link, useLocation } from "react-router-dom"
import { useArticles } from "../context/ArticlesContext"
import { useAuth } from "../context/AuthContext"

function Navigation() {
  const location = useLocation()

  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const { getUserSavedArticles } = useArticles()

  const savedCount = isAuthenticated ? getUserSavedArticles().length : 0

  return (
    <nav>
      <div className="nav-container">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <h1 className="nav-brand">NewsReader</h1>

          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>

            <Link
              to="/search"
              className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}
            >
              Search
            </Link>

            <Link
              to="/saved"
              className={`nav-link ${location.pathname === "/saved" ? "active" : ""}`}
            >
              Saved Articles ({savedCount})
            </Link>

            {isAuthenticated && isAdmin() && (
              <Link
                to="/admin"
                className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
              >
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="nav-user">
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span>
                {user.username} ({user.role})
              </span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
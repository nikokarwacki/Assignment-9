import { createContext, useContext, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "regular", password: "regular123", role: "regular" },
]

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const isAuthenticated = !!user

  function login(username, password) {
    const found = USERS.find(
      u => u.username === username && u.password === password
    )
    if (!found) return { ok: false, message: "Invalid username or password." }

    setUser({ username: found.username, role: found.role })
    return { ok: true }
  }

  function logout() {
    setUser(null)
    navigate("/")
  }

  function isAdmin() {
    return user?.role === "admin"
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout, isAdmin }),
    [user, isAuthenticated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Neo4j Graph App</h1>
      <nav style={{ marginBottom: 12 }}>
        <Link to="/">Register</Link> | <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  )
}
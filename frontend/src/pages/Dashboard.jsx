import React, { useEffect, useState } from 'react'
import { me } from '../api'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Not logged in')
      return
    }
    me(token).then(res => {
      if (res.error) setError(res.error)
      else setUser(res.user)
    })
  }, [])

  if (error) return <div>{error}</div>
  if (!user) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>Dashboard</h2>
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Role:</strong> {user.role}</div>

      <p style={{ marginTop: 12 }}>
        Later: visualize graph, create relationships, search people, etc.
      </p>
    </div>
  )
}

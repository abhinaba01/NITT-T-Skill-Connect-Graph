import React, { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const res = await login(form)
    if (res.error) setError(res.error)
    else if (res.token) {
      localStorage.setItem('token', res.token)
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Login</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit">Login</button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  )
}

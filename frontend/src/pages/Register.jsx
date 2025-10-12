import React, { useState } from 'react'
import { register } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(null)
    const res = await register(form)
    if (res.error) setError(res.error)
    else {
      alert('Registered! Please login.')
      navigate('/login')
    }
  }


return (
  <form onSubmit={submit} style={{ maxWidth: 420 }}>
    <h2>Register</h2>

    <div>
      <label>Name</label>
      <input
        type="text"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
    </div>

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

    <div>
      <label>Role</label>
      <select
        value={form.role}
        onChange={e => setForm({ ...form, role: e.target.value })}
      >
        <option value="faculty">Faculty</option>
        <option value="student">Student</option>
        <option value="staff">Staff</option>
        <option value="alumni">Alumni</option>
      </select>
    </div>

    <div style={{ marginTop: 12 }}>
      <button type="submit">Register</button>
    </div>

    {error && <div style={{ color: 'red' }}>{error}</div>}
  </form>
);
}

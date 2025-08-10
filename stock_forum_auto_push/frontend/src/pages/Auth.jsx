import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth(){
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState('')
  const navigate = useNavigate()
  async function register(){
    const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/auth/register', {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ name, email, password })
    })
    if(res.ok){ const data = await res.json(); localStorage.setItem('token', data.token); navigate('/') } else alert('error')
  }
  async function login(){
    const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/auth/login', {
      method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email, password })
    })
    if(res.ok){ const data = await res.json(); localStorage.setItem('token', data.token); navigate('/') } else alert('login failed')
  }
  return (
    <div style={{maxWidth:600}}>
      <h3>Register</h3>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)}/><br/>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><br/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><br/>
      <button onClick={register}>Register</button>
      <hr/>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><br/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/><br/>
      <button onClick={login}>Login</button>
    </div>
  )
}

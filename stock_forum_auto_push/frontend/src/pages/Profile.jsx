import React, {useEffect, useState} from 'react'
import { API } from '../api'

export default function Profile(){
  const [me, setMe] = useState(null)
  useEffect(()=>{ const token = localStorage.getItem('token'); if(!token) return; fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/users/me', { headers: { Authorization: 'Bearer '+token } }).then(r=>r.json()).then(setMe) },[])
  if(!me) return <div>Please login</div>
  return (
    <div>
      <h3>{me.name}</h3>
      <img src={(import.meta.env.VITE_API_BASE||'http://localhost:4000') + me.avatar_url} width="120" alt="avatar"/>
      <p>Reputation: {me.reputation}</p>
      <p>Badges: {me.badges}</p>
    </div>
  )
}

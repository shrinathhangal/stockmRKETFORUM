import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../api'
import io from 'socket.io-client'
import { marked } from 'marked'

const socket = io(import.meta.env.VITE_API_BASE || 'http://localhost:4000')

export default function Post(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(()=>{
    fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/posts/' + id).then(r=>r.json()).then(setData)
    socket.on('new_comment', (payload)=>{ if(payload.post_id == id) setData(prev=> ({...prev, Comments:[...(prev?.Comments||[]), payload.comment]})) })
    return ()=> socket.off('new_comment')
  },[id])

  async function submitComment(){
    const token = localStorage.getItem('token')
    if(!token){ alert('login first'); return }
    await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/posts/' + id + '/comments', {
      method:'POST', headers:{ 'Content-Type':'application/json', Authorization: 'Bearer '+token }, body: JSON.stringify({ body: comment })
    })
    setComment('')
    const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/posts/' + id)
    setData(await res.json())
  }

  if(!data) return <div>Loading...</div>
  return (
    <div>
      <h2>{data.title}</h2>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(data.body||'') }} />
      <hr/>
      <h4>Comments</h4>
      {(data.Comments||[]).map(c=>(
        <div key={c.id} className="comment"><b>{c.UserId}</b> <small>{new Date(c.createdAt).toLocaleString()}</small><p>{c.body}</p></div>
      ))}
      <div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3}></textarea><br/>
        <button onClick={submitComment}>Add Comment</button>
      </div>
    </div>
  )
}

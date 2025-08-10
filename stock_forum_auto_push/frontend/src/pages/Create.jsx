import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../api'

export default function Create(){
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState(null)
  const navigate = useNavigate()
  async function submit(){
    const token = localStorage.getItem('token')
    if(!token){ alert('login first'); return }
    const fd = new FormData()
    fd.append('title', title)
    fd.append('body', body)
    if(files) for(const f of files) fd.append('files', f)
    const res = await fetch((import.meta.env.VITE_API_BASE||'http://localhost:4000') + '/api/posts', { method:'POST', body: fd, headers: { Authorization: 'Bearer '+token } })
    if(res.ok){ const post = await res.json(); navigate('/post/'+post.id) } else alert('error creating post')
  }
  return (
    <div>
      <h3>Create Post</h3>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/><br/>
      <textarea placeholder="Write in Markdown" rows={10} value={body} onChange={e=>setBody(e.target.value)}></textarea><br/>
      <input type="file" multiple onChange={e=>setFiles(e.target.files)}/><br/>
      <button onClick={submit}>Post</button>
    </div>
  )
}

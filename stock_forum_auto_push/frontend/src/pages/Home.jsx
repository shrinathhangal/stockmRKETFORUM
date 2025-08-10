import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { API } from '../api'

export default function Home(){
  const [posts, setPosts] = useState([])
  useEffect(()=>{ fetch(API + '/api/posts').then(r=>r.json()).then(setPosts) },[])
  return (
    <div>
      <h3>Recent Posts</h3>
      {posts.map(p => (
        <article key={p.id} className="card">
          <h4><Link to={'/post/'+p.id}>{p.title}</Link></h4>
          <p dangerouslySetInnerHTML={{__html: p.body? p.body.slice(0,400) : ''}}></p>
          <small>{new Date(p.createdAt).toLocaleString()}</small>
        </article>
      ))}
    </div>
  )
}

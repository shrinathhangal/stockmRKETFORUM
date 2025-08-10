import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Post from './pages/Post'
import Create from './pages/Create'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import './styles.css'

function App(){
  return (
    <BrowserRouter>
      <header className="topbar">
        <Link to="/"><h2>Stock Forum</h2></Link>
        <nav>
          <Link to="/create">Create</Link>
          <Link to="/auth">Login/Register</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/post/:id" element={<Post/>} />
          <Route path="/create" element={<Create/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(<App />)

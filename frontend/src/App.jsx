import { useState } from 'react'
import Join from './component/Join'
import Create from './component/Create'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HostPage from './component/HostPage'
import QuizRoom from './component/QuizRoom'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/host/:roomCode" element={<HostPage/>} />
        <Route path="/" element={<Join />} />
        <Route path="/create" element={<Create />} />
        <Route path="/quiz/:roomCode" element={<QuizRoom />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

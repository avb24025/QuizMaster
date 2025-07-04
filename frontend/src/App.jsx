import { useState } from 'react'
import Join from './component/Join'
import Create from './component/Create'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
    </>
  )
}

export default App

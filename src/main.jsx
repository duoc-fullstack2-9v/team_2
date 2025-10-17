import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from '../src/pages/Home.jsx'
import Login from '../src/pages/Login.jsx'
import Calendario from "./pages/Calendario.jsx";
import Registro from "./pages/Registro.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/calendario" element={<Calendario/>}/>
        <Route path="/registro" element={<Registro/>}/>

      </Routes>  
    </HashRouter>
  </StrictMode>,
)

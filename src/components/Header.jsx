import logo from '../assets/imagenes/calend.jpeg'

function Header() {
  return (
    <div className="titulo-con-logo">
      <div className="logo-titulo">
        <img src={logo} alt="Tu Turno" className="logo-img" />
        <h2 className="titulo-texto">Tu Turno</h2>
      </div>
    </div>
  )
}

export default Header
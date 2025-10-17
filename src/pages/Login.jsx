import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Nav></Nav>
        <main>
          <div className="login-container">
            <h2>Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="usuario">Correo electrónico:</label>
              <input
                type="email"
                id="usuario"
                name="usuario"
                placeholder="tucorreo@tuturno.com" //diga tu correo previo
                title="Ingresa tu correo electrónico" //cuando te pones encima cn el puntero
                autoComplete="username" //lo que ya escribi alguna vez
                required //si o si ingresar
              />

              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="•••••••••••••••"
                title="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <Link to="/calendario" className="entrar">Entrar</Link>
            </form>

            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/Registro" className="enlace">Regístrate aquí</Link>
            </p>
          </div>
        </main>

          <Footer></Footer>
    </>
  );
}

export default Login;

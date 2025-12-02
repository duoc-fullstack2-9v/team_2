import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { useState } from "react";
import { authApi } from "../services/api";
import { saveUserSession } from "../services/session";


function Login() {
  const navigate = useNavigate();


  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    console.log("Intento de login", { correo, password });


    // Validación local: no permitir campos vacíos
    if (!correo.trim() || !password.trim()) {
      setError("Debes completar ambos campos.");
      return;
    }


    try {
      const requestBody = {
        correo: correo.trim(),
        password: password.trim(),
      };


      // Llamada al backend
      const data = await authApi.login(requestBody);


      // Si por alguna razón no viene nada, no navegamos
      if (!data) {
        throw new Error("Respuesta inválida del servidor.");
      }


      // Guardar usuario en sesión
      saveUserSession(data);


      // Redirigir al calendario solo si todo salió bien
      navigate("/calendario");
    } catch (err) {
      console.error("Error en login:", err);


      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión.");
      }
    }
  };


  return (
    <>
      <Nav />


      <main>
        <div className="login-container">
          <h2>Iniciar Sesión</h2>


          <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="usuario">Correo electrónico:</label>
            <input
              type="email"
              id="usuario"
              name="usuario"
              placeholder="tucorreo@tuturno.com"
              title="Ingresa tu correo electrónico"
              autoComplete="username"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />


            {error && <p className="error">{error}</p>}


            <button type="submit" className="entrar">
              Entrar
            </button>
          </form>


          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/Registro" className="enlace">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>


      <Footer />
    </>
  );
}


export default Login;

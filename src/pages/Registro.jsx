// src/pages/Registro.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { authApi } from "../services/api";




const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RUT_RE = /^[0-9]{7,8}$/;
const PASS_RE = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


export default function Registro() {
  const navigate = useNavigate();


  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    sexo: "",
    edad: "",
    correo: "",
    clave: "",
    confirmarClave: "",
  });


  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});


  const validateField = (id, value, all = form) => {
    switch (id) {
      case "nombre":
      case "apellido":
        if (!value.trim()) return "Este campo es obligatorio.";
        return "";
      case "rut":
        if (!value.trim()) return "El RUT es obligatorio.";
        if (!RUT_RE.test(value.trim())) return "Debe tener 7 u 8 dígitos, sin puntos ni dígito verificador.";
        return "";
      case "sexo":
        if (!value) return "Selecciona una opción.";
        return "";
      case "edad": {
        if (value === "" || value === null) return "Ingresa tu edad.";
        const n = Number(value);
        if (Number.isNaN(n)) return "Edad inválida.";
        if (n < 0 || n > 120) return "Edad fuera de rango (0–120).";
        return "";
      }
      case "correo":
        if (!value.trim()) return "El correo es obligatorio.";
        if (!EMAIL_RE.test(value.trim())) return "Formato de correo inválido (usuario@dominio.com).";
        return "";
      case "clave":
        if (!value) return "La contraseña es obligatoria.";
        if (!PASS_RE.test(value))
          return "Mínimo 8 y debe incluir mayúscula, minúscula, número y símbolo (@$!%*?&).";
        return "";
      case "confirmarClave":
        if (!value) return "Debes confirmar la contraseña.";
        if (value !== all.clave) return "Las contraseñas no coinciden.";
        return "";
      default:
        return "";
    }
  };


  const validateForm = (values) => {
    const e = {};
    Object.keys(values).forEach((k) => {
      const msg = validateField(k, values[k], values);
      if (msg) e[k] = msg;
    });
    return e;
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [id]: value };
      // valida en tiempo real el campo editado
      const msg = validateField(id, value, next);
      setErrors((old) => ({ ...old, [id]: msg }));
      // si cambió clave, revalida confirmarClave
      if (id === "clave" && touched.confirmarClave) {
        const msg2 = validateField("confirmarClave", next.confirmarClave, next);
        setErrors((old) => ({ ...old, confirmarClave: msg2 }));
      }
      return next;
    });
  };


  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched((t) => ({ ...t, [id]: true }));
  };


  const handleSubmit = async (e) => {
  e.preventDefault();


  const formEl = e.currentTarget;
  if (!formEl.checkValidity()) {
    formEl.reportValidity();
    return;
  }


  const allErrors = validateForm(form);
  setErrors(allErrors);
  setTouched(
    Object.fromEntries(Object.keys(form).map((k) => [k, true]))
  );


  if (Object.keys(allErrors).length > 0) return;


  // Si llega aquí, el formulario es válido → llamamos al backend
  try {
    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      rut: form.rut,
      sexo: form.sexo,
      edad: Number(form.edad),
      correo: form.correo,
      password: form.clave, // IMPORTANTE: debe llamarse igual que en RegisterRequest
    };


    await authApi.registro(payload);


    alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
    navigate("/login");
  } catch (err) {
    alert(`Error al registrar usuario: ${err.message}`);
  }
};


  const hasErrors = Object.values(errors).some(Boolean);
  const someEmpty = Object.values(form).some((v) => String(v).trim() === "");
  const canSubmit = !hasErrors && !someEmpty;


  return (
    <>
      <Nav />
      <main>
        <div className="register-container">
          <h2>Registro de Usuario</h2>


          <form id="registro" onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.nombre && errors.nombre)}
                className={touched.nombre && errors.nombre ? "input error" : "input"}
              />
              {touched.nombre && errors.nombre && <small className="error-msg">{errors.nombre}</small>}
            </div>


            <div className="campo">
              <label htmlFor="apellido">Apellido:</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                required
                value={form.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.apellido && errors.apellido)}
                className={touched.apellido && errors.apellido ? "input error" : "input"}
              />
              {touched.apellido && errors.apellido && <small className="error-msg">{errors.apellido}</small>}
            </div>


            <div className="campo">
              <label htmlFor="rut">Rut:</label>
              <input
                type="text"
                id="rut"
                name="rut"
                required
                placeholder="Ej: 12345678"
                inputMode="numeric"
                pattern="^[0-9]+$"
                value={form.rut}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.rut && errors.rut)}
                className={touched.rut && errors.rut ? "input error" : "input"}
              />
              {touched.rut && errors.rut && <small className="error-msg">{errors.rut}</small>}
            </div>


            <div className="campo">
              <label htmlFor="sexo">Sexo:</label>
              <select
                id="sexo"
                name="sexo"
                required
                value={form.sexo}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.sexo && errors.sexo)}
                className={touched.sexo && errors.sexo ? "input error" : "input"}
              >
                <option value="">Seleccione</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
              {touched.sexo && errors.sexo && <small className="error-msg">{errors.sexo}</small>}
            </div>


            <div className="campo">
              <label htmlFor="edad">Edad:</label>
              <input
                type="number"
                id="edad"
                name="edad"
                min="0"
                max="120"
                required
                value={form.edad}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.edad && errors.edad)}
                className={touched.edad && errors.edad ? "input error" : "input"}
              />
              {touched.edad && errors.edad && <small className="error-msg">{errors.edad}</small>}
            </div>


            <div className="campo">
              <label htmlFor="correo">Correo electrónico:</label>
              <input
                type="email"
                id="correo"
                name="correo"
                required
                placeholder="tucorreo@tuturno.com"
                autoComplete="email"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.correo && errors.correo)}
                className={touched.correo && errors.correo ? "input error" : "input"}
              />
              {touched.correo && errors.correo && <small className="error-msg">{errors.correo}</small>}
            </div>


            <div className="campo">
              <label htmlFor="clave">Contraseña:</label>
              <input
                type="password"
                id="clave"
                name="clave"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                title="Mín 8, con mayúscula, minúscula, número y símbolo (@$!%*?&)."
                value={form.clave}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.clave && errors.clave)}
                className={touched.clave && errors.clave ? "input error" : "input"}
              />
              {touched.clave && errors.clave && <small className="error-msg">{errors.clave}</small>}
            </div>


            <div className="campo">
              <label htmlFor="confirmarClave">Confirmar contraseña:</label>
              <input
                type="password"
                id="confirmarClave"
                name="confirmarClave"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={form.confirmarClave}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.confirmarClave && errors.confirmarClave)}
                className={touched.confirmarClave && errors.confirmarClave ? "input error" : "input"}
              />
              {touched.confirmarClave && errors.confirmarClave && (
                <small className="error-msg">{errors.confirmarClave}</small>
              )}
            </div>


            <button type="submit" className="entrar" disabled={!canSubmit}>
              Registrarse
            </button>


            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="enlace">Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}

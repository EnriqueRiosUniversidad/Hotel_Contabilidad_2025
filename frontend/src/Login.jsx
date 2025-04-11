import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="flex h-screen font-poppins overflow-hidden">
      {/* Imagen lado izquierdo */}
      <div className="w-1/2 h-full">
        <img
          src="/login-image.jpg"
          alt="Hotel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario lado derecho */}
      <div className="w-1/2 bg-[#A3F7B5] flex items-center justify-center">
        <div className="bg-[#C5F8C7] border border-gray-300 rounded-xl px-10 py-8 shadow-2xl w-[380px]">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-black mb-6 italic">
            Bienvenido
          </h2>

          {/* Campo Usuario */}
          <div className="mb-4">
            <label className="block text-black font-medium mb-1">Usuario:</label>
            <input
              type="text"
              placeholder="Ingrese su usuario"
              className="input input-bordered w-full rounded-lg bg-white text-black"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="mb-6">
            <label className="block text-black font-medium mb-1">Contraseña:</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="input input-bordered w-full rounded-lg bg-white text-black"
            />
          </div>

          {/* Botón */}
          <button
            onClick={handleLogin}
            className="btn w-full bg-green-600 text-white hover:bg-green-700 rounded-full transition-all duration-200 shadow"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home");
  };
  return (
    <div className="flex h-screen font-poppins overflow-hidden">
      {/* Imagen izquierda */}
      <div className="w-1/2 h-full">
        <img
          src="/login-image.jpg"
          alt="Hotel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Formulario lado derecho */}
      <div className="w-1/2 bg-[#A3F7B5] flex items-center justify-center">
        <div className="bg-white rounded-xl p-10 shadow-lg w-[400px]">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain" />
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Bienvenido
          </h2>

          {/* Usuario */}
          <div className="mb-5">
            <label className="block text-gray-800 font-medium mb-1">Usuario:</label>
            <input
              type="text"
              placeholder="Ingrese su usuario"
              className="input input-bordered w-full bg-white text-black"
            />
          </div>

          {/* Contraseña */}
          <div className="mb-6">
            <label className="block text-gray-800 font-medium mb-1">Contraseña:</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              className="input input-bordered w-full bg-white text-black"
            />
          </div>

          {/* Botón */}
          <button
      className="btn w-full bg-green-600 text-white hover:bg-green-700 rounded-lg shadow"
      onClick={handleLogin}
    >
      Ingresar
    </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

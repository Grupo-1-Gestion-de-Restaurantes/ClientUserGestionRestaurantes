import { Routes, Route } from "react-router-dom";
import { HomePage } from "../../features/home/pages/HomePage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ======================================= */}
      {/* MÓDULO LANDING: EXPERIENCIA 3D          */}
      {/* ======================================= */}
      
      {/* La única ruta que le importa a este micro-frontend */}
      <Route path="/" element={<HomePage />} />

      {/* ======================================= */}
      {/* FALLBACK LOCAL                            */}
      {/* ======================================= */}
      {/* Si alguien escribe turl.com/cualquier-cosa en ESTE módulo, le mostramos un 404 temático */}
      <Route 
        path="*" 
        element={
          <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-bold text-2xl">
            <h1 className="text-[#f4be2c] text-6xl mb-4">404</h1>
            <p>Estación Espacial No Encontrada</p>
            {/* Como Auth es otro módulo, simplemente lo mandamos al inicio de ESTE módulo */}
            <a href="/" className="mt-8 px-6 py-2 border-2 border-[#f4be2c] text-[#f4be2c] rounded hover:bg-[#f4be2c] hover:text-black transition-colors">
              Volver a la Base
            </a>
          </div>
        } 
      />
    </Routes>
  );
};
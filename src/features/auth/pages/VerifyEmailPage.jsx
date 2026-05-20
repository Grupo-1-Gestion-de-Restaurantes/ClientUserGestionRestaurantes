import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { verifyEmail } from "../../../shared/api/auth";
import { showError, showSuccess } from "../../../shared/utils/toast";

export const VerifyEmailPage = () => {
  const [params] = useSearchParams();

  const tokenFromParams = params.get("token") || "";

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    document.title = "Verificar correo · Express";
    let alive = true;
    const token = tokenFromParams;

    if (!token) {
      setStatus("error");
      return undefined;
    }

    (async () => {
      try {
        await verifyEmail(token);
        if (!alive) return;
        setStatus("success");
        showSuccess("Correo verificado correctamente");
      } catch (err) {
        if (!alive) return;
        setStatus("error");
        showError(
          err.response?.data?.message || "El enlace es inválido o expiró",
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full font-sans text-on-base flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-2 border-[3px] border-stroke-strong rounded-3xl p-8 text-center shadow-brutal">
        <div className="flex justify-center mb-4">
          {status === "loading" && (
            <Loader2 className="text-secondary animate-spin-slow" size={48} />
          )}
          {status === "success" && (
            <CheckCircle2 className="text-secondary" size={56} />
          )}
          {status === "error" && <XCircle className="text-primary" size={56} />}
        </div>

        <h1 className="font-bangers tracking-wider text-3xl text-on-base">
          {status === "loading" && "VERIFICANDO…"}
          {status === "success" && "¡VERIFICADO!"}
          {status === "error" && "NO SE PUDO VERIFICAR"}
        </h1>
        <p className="text-sm text-on-base-muted mt-2">
          {status === "loading" && "Estamos confirmando tu correo."}
          {status === "success" &&
            "Tu cuenta ya está activa. Inicia sesión y a comer."}
          {status === "error" &&
            "El enlace puede estar incompleto o haber expirado."}
        </p>

        {status !== "loading" && (
          <Link
            to="/auth"
            className="mt-6 inline-block px-6 py-3 bg-primary text-on-primary font-bangers tracking-widest rounded-xl border-[3px] border-stroke-strong shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_black] transition-all"
          >
            IR A INICIAR SESIÓN
          </Link>
        )}
      </div>
    </main>
  );
};

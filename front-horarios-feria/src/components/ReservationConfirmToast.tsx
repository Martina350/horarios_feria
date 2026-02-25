import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const CONFETTI_DURATION_MS = 4000;
const MESSAGE_VISIBLE_MS = 5000;

/**
 * Dispara confetti durante unos segundos (suave, no bloqueante).
 */
function runConfetti() {
  const end = Date.now() + CONFETTI_DURATION_MS;
  const colors = ["#A72974", "#006837", "#004DB1", "#F7B800"];

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
  // Una ráfaga inicial más visible
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.6 },
    colors,
  });
}

/**
 * Detecta ?confirmed=true|error en la URL, muestra confetti + mensaje y limpia el query.
 */
export function ReservationConfirmToast() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const confirmed = searchParams.get("confirmed");
  const [message, setMessage] = useState<"success" | "error" | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (confirmed !== "true" && confirmed !== "error") return;

    setMessage(confirmed === "true" ? "success" : "error");

    if (confirmed === "true") {
      runConfetti();
    }

    const timeout = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        const path = window.location.pathname || "/";
        navigate(path, { replace: true });
      }, 300);
    }, MESSAGE_VISIBLE_MS);

    return () => clearTimeout(timeout);
  }, [confirmed, navigate]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      navigate(window.location.pathname || "/", { replace: true });
    }, 300);
  };

  if (confirmed !== "true" && confirmed !== "error") {
    return null;
  }
  if (message === null) return null;

  const isSuccess = message === "success";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
      aria-live="polite"
    >
      <div
        className={`
          pointer-events-auto max-w-md w-full rounded-2xl shadow-2xl p-6 text-center
          animate-[fadeSlide_0.4s_ease-out]
          ${isSuccess ? "bg-white border-2 border-secondary" : "bg-white border-2 border-red-400"}
        `}
        style={{
          animation: "fadeSlide 0.4s ease-out",
        }}
      >
        {visible && (
          <>
            <div className="text-5xl mb-3">
              {isSuccess ? "✅" : "❌"}
            </div>
            <h2
              className={`text-xl font-bold font-gothic ${
                isSuccess ? "text-secondary" : "text-red-600"
              }`}
            >
              {isSuccess
                ? "Tu reserva ha sido confirmada"
                : "No se pudo confirmar la reserva"}
            </h2>
            <p className="mt-2 text-[#6c757d] font-myriad text-sm">
              {isSuccess
                ? "Gracias por confirmar. Te esperamos en Global Money Week."
                : "El enlace puede haber expirado o ser inválido. Intenta hacer una nueva reserva."}
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 px-5 py-2 rounded-lg font-medium bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Cerrar
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

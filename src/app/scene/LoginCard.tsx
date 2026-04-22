import type { FormEvent } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../features/auth/AuthContext";
import { AUTH_EMAIL_COORDINATOR, AUTH_EMAIL_GIF_EXAMPLE, AUTH_PASSWORD } from "../../features/auth/constants";
import { CARD_EXIT_DURATION_S } from "./sceneConstants";
import { useVisualTransition } from "./VisualTransitionContext";

/**
 * Tarjeta de credenciales (solo UI). La escena padre controla el `sceneStep`;
 * aquí animamos salida cuando pasa a `loginCardExit`.
 */
export function LoginCard() {
  const { login } = useAuth();
  const { sceneStep, runPostLoginTransition } = useVisualTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isExiting = sceneStep === "loginCardExit";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    const normalized = email.trim().toLowerCase();
    const target =
      normalized === AUTH_EMAIL_COORDINATOR.toLowerCase() ? "/coordinator" : "/";
    await runPostLoginTransition(target);
  }

  return (
    <motion.div
      className="w-full max-w-sm border border-gray-300 bg-white p-8 shadow-sm"
      initial={false}
      animate={
        isExiting
          ? { opacity: 0, scale: 0.96, y: -6 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ duration: CARD_EXIT_DURATION_S, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1 className="text-center text-lg font-semibold text-gray-900">Carga LMS</h1>
      <p className="mt-1 text-center text-sm text-gray-500">Iniciar sesion</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="login-email">
            Correo
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700" htmlFor="login-password">
            Contrasena
          </label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-gray-700">{error}</p> : null}
        <button
          type="submit"
          className="w-full border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Entrar
        </button>
      </form>

      <p className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
        Coordinador: <span className="font-mono text-gray-700">{AUTH_EMAIL_COORDINATOR}</span>
        <br />
        GIF (dominio <span className="font-mono text-gray-700">gif.edu.co</span>, ej.{" "}
        <span className="font-mono text-gray-700">{AUTH_EMAIL_GIF_EXAMPLE}</span>)
        <br />
        Contrasena (ambos): <span className="font-mono text-gray-700">{AUTH_PASSWORD}</span>
      </p>
    </motion.div>
  );
}

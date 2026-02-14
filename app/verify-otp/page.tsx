"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<"error" | "success">("error");
  const [loading, setLoading] = useState(false);

  const VERIFY_API = "/api/otp/verify";
  const RESEND_API = "/api/otp/resend";

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("verify_user_id")
      : null;

  /* ================= CHECK SESSION ================= */
  useEffect(() => {
    if (!userId) {
      showMessage("Session expirée. Veuillez vous réinscrire.");
    }
  }, [userId]);

  /* ================= MESSAGE ================= */
  function showMessage(msg: string, msgType: "error" | "success" = "error") {
    setMessage(msg);
    setType(msgType);
  }

  /* ================= VERIFY OTP ================= */
  async function verifyOTP() {
    if (!userId) {
      showMessage("Session invalide, veuillez recommencer.");
      return;
    }

    if (otp.length !== 6) {
      showMessage("Veuillez entrer un code à 6 chiffres");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(VERIFY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId), // ✅ FIX
          code: otp,
          type: "PHONE",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showMessage(data.message || "Code incorrect ou expiré");
        return;
      }

      // ✅ SUCCESS
      showMessage("Compte vérifié avec succès 🎉", "success");

      // 🔐 TOKEN
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }

      // CLEAN
      localStorage.removeItem("verify_user_id");

      setTimeout(() => router.push("/"), 1200);

    } catch {
      showMessage("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  /* ================= RESEND OTP ================= */
  async function resendOTP() {
    if (!userId) {
      showMessage("Session invalide");
      return;
    }

    try {
      const res = await fetch(RESEND_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: Number(userId), // ✅ FIX
          type: "PHONE",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        showMessage(data.message || "Erreur lors de l’envoi");
        return;
      }

      showMessage("Code renvoyé 📲", "success");

    } catch {
      showMessage("Erreur réseau");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-center">
        Vérification du téléphone
      </h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded text-sm ${
            type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Code à 6 chiffres"
        className="w-full border rounded px-3 py-2 mb-4 text-center tracking-widest"
        maxLength={6}
        inputMode="numeric"
        disabled={loading}
      />

      <button
        onClick={verifyOTP}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Vérification..." : "Vérifier"}
      </button>

      <button
        onClick={resendOTP}
        disabled={loading}
        className="block mx-auto mt-4 text-blue-600 text-sm hover:underline"
      >
        Renvoyer le code
      </button>
    </div>
  );
}

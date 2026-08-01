"use client";

import { useState } from "react";
import {
  Form,
  TextField,
  Label,
  Input,
  TextArea,
  FieldError,
} from "react-aria-components";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const inputClasses =
  "w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-bg)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-bright)] focus:ring-2 focus:ring-[var(--color-bright)]/25 data-[invalid]:border-red-500";

const labelClasses = "text-sm font-semibold text-[var(--color-text)]";

export function ContactoForm({ accessKey = "" }) {
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("submitting");
    setErrorMsg("");

    const formData = new FormData(formEl);
    formData.append("access_key", accessKey);
    formData.append("subject", "Nueva solicitud de propuesta — Northa Digital");
    formData.append("from_name", "Northa Digital · Sitio");

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        formEl.reset();
      } else {
        throw new Error(json.message || "No se pudo enviar el mensaje.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-12 text-center text-emerald-200"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <CheckCircle className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="text-2xl font-bold text-emerald-100">
              Tu solicitud fue enviada
            </h3>
            <p className="max-w-md text-sm text-emerald-200/85">
              Gracias por escribirnos. Revisaremos tu mensaje y te
              responderemos a la brevedad posible.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-2 rounded-full border border-emerald-400/40 bg-white/5 px-5 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300"
            >
              Enviar otra solicitud
            </button>
          </motion.div>
        ) : (
          <Form
            key="form"
            onSubmit={onSubmit}
            validationBehavior="native"
            className="flex flex-col gap-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextField name="nombre" isRequired>
                <Label className={labelClasses}>Nombre completo *</Label>
                <Input className={cn("mt-2", inputClasses)} placeholder="Tu nombre" />
                <FieldError className="mt-1 text-xs text-red-400" />
              </TextField>

              <TextField name="municipio" isRequired>
                <Label className={labelClasses}>Municipio o cargo *</Label>
                <Input
                  className={cn("mt-2", inputClasses)}
                  placeholder="Ej. Municipio de… / Secretaría de…"
                />
                <FieldError className="mt-1 text-xs text-red-400" />
              </TextField>
            </div>

            <TextField name="email" type="email" isRequired>
              <Label className={labelClasses}>Correo electrónico *</Label>
              <Input
                className={cn("mt-2", inputClasses)}
                placeholder="tu@correo.gob.mx"
              />
              <FieldError className="mt-1 text-xs text-red-400" />
            </TextField>

            <TextField name="mensaje" isRequired>
              <Label className={labelClasses}>¿Qué necesitas? *</Label>
              <TextArea
                rows={5}
                className={cn("mt-2 resize-y", inputClasses)}
                placeholder="Cuéntanos sobre tu municipio y lo que buscas…"
              />
              <FieldError className="mt-1 text-xs text-red-400" />
            </TextField>

            <AnimatePresence>
              {status === "error" && (
                <motion.div
                  key="error"
                  role="alert"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Hubo un problema al enviar. Intenta de nuevo o escríbenos
                    directamente.
                    {errorMsg ? (
                      <span className="mt-1 block text-xs text-red-300/70">
                        Detalle técnico: {errorMsg}
                      </span>
                    ) : null}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="gradient-brand inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_34px_-10px_rgba(255,46,126,0.7)] transition-transform duration-200 hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Enviando…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Solicitar propuesta
                </>
              )}
            </button>
          </Form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactoForm;

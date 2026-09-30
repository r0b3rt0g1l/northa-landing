"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/es";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Field, inputClass } from "./Field";
import { FormStatus } from "./FormStatus";
import { EMAIL_RE, PHONE_RE, useLeadSubmit } from "./useLeadSubmit";
import { CerroLoader } from "@/components/brand/CerroLoader";
import { Turnstile, turnstileEnabled } from "./Turnstile";

/** Formulario corto para "Arma tu proyecto": el mensaje ya viene armado. */
export function LeadMiniForm({
  dict,
  locale,
  privacyHref,
  newTabLabel,
  defaultName,
  message,
  service,
  source,
}: {
  dict: Dictionary["form"];
  locale: "es" | "en";
  privacyHref: string;
  newTabLabel: string;
  defaultName: string;
  message: string;
  service?: string;
  source: "scope" | "form";
}) {
  const id = useId();
  const [name, setName] = useState(defaultName);
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, submit } = useLeadSubmit();
  const [token, setToken] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const c = contact.trim();
    const isEmail = EMAIL_RE.test(c);
    const isPhone = PHONE_RE.test(c);
    if (name.trim().length < 2) return setError(dict.errors.name);
    if (!isEmail && !isPhone) return setError(dict.errors.contact);
    if (!consent) return setError(dict.errors.consent);
    if (turnstileEnabled && !token) return setError(dict.errors.captcha);
    setError(null);
    await submit({
      name: name.trim(),
      email: isEmail ? c : "",
      phone: isEmail ? "" : c,
      service,
      message,
      locale,
      source,
      consent: true,
      turnstileToken: token,
    });
  };

  if (status.state === "success") {
    return <FormStatus status={status} dict={dict} newTabLabel={newTabLabel} fallbackWhatsapp={whatsappUrl(message)} />;
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 rounded-2xl border border-line bg-bg/50 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-n`} label={dict.name}>
          <input
            id={`${id}-n`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={cn(inputClass, "h-11")}
          />
        </Field>
        <Field id={`${id}-c`} label={`${dict.email} / ${dict.phone}`}>
          <input
            id={`${id}-c`}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            autoComplete="email"
            className={cn(inputClass, "h-11")}
          />
        </Field>
      </div>
      <label className="flex items-start gap-3 text-sm text-dim">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[var(--accent-strong)]"
        />
        <span>
          {dict.consent}{" "}
          <a href={privacyHref} className="text-accent-ink underline underline-offset-2">
            {dict.consentLink}
          </a>
          .
        </span>
      </label>
      <Turnstile onToken={setToken} locale={locale} />
      {error && (
        <p role="alert" className="text-sm text-accent-ink">
          {error}
        </p>
      )}
      <FormStatus status={status} dict={dict} newTabLabel={newTabLabel} fallbackWhatsapp={whatsappUrl(message)} />
      <button
        type="submit"
        disabled={status.state === "sending"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-bg transition-opacity disabled:opacity-60 sm:justify-self-start"
      >
        {status.state === "sending" ? (
          <>
            <CerroLoader size={20} decorative mono />
            {dict.sending}
          </>
        ) : (
          dict.submit
        )}
      </button>
    </form>
  );
}

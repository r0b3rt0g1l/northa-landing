"use client";

import { useId, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries/es";
import { cn } from "@/lib/utils";
import { Field, inputClass } from "./Field";
import { FormStatus } from "./FormStatus";
import { EMAIL_RE, PHONE_RE, useLeadSubmit } from "./useLeadSubmit";
import { CerroLoader } from "@/components/brand/CerroLoader";
import { Turnstile, turnstileEnabled } from "./Turnstile";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent", string>>;

export function ContactForm({
  dict,
  locale,
  services,
  privacyHref,
  newTabLabel,
  fallbackWhatsapp,
}: {
  dict: Dictionary["form"];
  locale: "es" | "en";
  services: string[];
  privacyHref: string;
  newTabLabel: string;
  fallbackWhatsapp: string;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const { status, submit } = useLeadSubmit();
  const [token, setToken] = useState<string | null>(null);
  const [captchaMissing, setCaptchaMissing] = useState(false);

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (name.length < 2) e.name = dict.errors.name;
    if (!email && !phone) e.email = dict.errors.contact;
    if (email && !EMAIL_RE.test(email)) e.email = dict.errors.email;
    if (phone && !PHONE_RE.test(phone)) e.phone = dict.errors.phone;
    if (message.length < 10) e.message = dict.errors.message;
    if (!data.get("consent")) e.consent = dict.errors.consent;
    return e;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (turnstileEnabled && !token) {
      setCaptchaMissing(true);
      return;
    }
    setCaptchaMissing(false);
    await submit({
      name: String(data.get("name")).trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      company: String(data.get("company") ?? "").trim() || undefined,
      service: String(data.get("service") ?? "") || undefined,
      message: String(data.get("message")).trim(),
      locale,
      source: "form",
      consent: true,
      website: String(data.get("website") ?? ""),
      turnstileToken: token,
    });
  };

  if (status.state === "success") {
    return <FormStatus status={status} dict={dict} newTabLabel={newTabLabel} fallbackWhatsapp={fallbackWhatsapp} />;
  }

  const described = (key: keyof Errors) => (errors[key] ? `${id}-${key}-error` : undefined);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-5" aria-busy={status.state === "sending"}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label={dict.name} error={errors.name}>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={described("name")}
            className={cn(inputClass, "h-12")}
          />
        </Field>
        <Field id={`${id}-company`} label={dict.company} optionalLabel={dict.optional}>
          <input id={`${id}-company`} name="company" autoComplete="organization" className={cn(inputClass, "h-12")} />
        </Field>
        <Field id={`${id}-email`} label={dict.email} error={errors.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={described("email")}
            className={cn(inputClass, "h-12")}
          />
        </Field>
        <Field id={`${id}-phone`} label={dict.phone} error={errors.phone}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={described("phone")}
            className={cn(inputClass, "h-12")}
          />
        </Field>
      </div>

      <Field id={`${id}-service`} label={dict.service} optionalLabel={dict.optional}>
        <select id={`${id}-service`} name="service" defaultValue="" className={cn(inputClass, "h-12 appearance-none bg-[length:12px] pr-10")}>
          <option value="">{dict.servicePlaceholder}</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value={dict.otherService}>{dict.otherService}</option>
        </select>
      </Field>

      <Field id={`${id}-message`} label={dict.message} error={errors.message}>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={4}
          maxLength={2000}
          required
          placeholder={dict.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={described("message")}
          className={cn(inputClass, "resize-y py-3")}
        />
      </Field>

      {/* Honeypot: invisible para personas y lectores de pantalla */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-2">
        <label className="flex items-start gap-3 text-sm text-dim">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={!!errors.consent}
            aria-describedby={described("consent")}
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
        {errors.consent && (
          <p id={`${id}-consent-error`} className="text-sm text-accent-ink">
            {errors.consent}
          </p>
        )}
      </div>

      <Turnstile onToken={setToken} locale={locale} />
      {captchaMissing && (
        <p role="alert" className="text-sm text-accent-ink">
          {dict.errors.captcha}
        </p>
      )}

      <FormStatus status={status} dict={dict} newTabLabel={newTabLabel} fallbackWhatsapp={fallbackWhatsapp} />

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-accent-strong px-8 font-semibold text-accent-contrast shadow-[0_12px_40px_-14px_var(--accent)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 sm:justify-self-start"
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

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  institution: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  sourcePage: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ContactForm({ defaultSubject, sourcePage }: { defaultSubject?: string; sourcePage?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { subject: defaultSubject || "", sourcePage: sourcePage || "" },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Submission failed");
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-10 text-center">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Message Sent</h2>
        <p className="mt-3 text-[var(--muted)]">We will respond as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input {...register("name")} placeholder="Name" className="w-full rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register("email")} placeholder="Email" className="w-full rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm" />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <input {...register("institution")} placeholder="Institution (optional)" className="w-full rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm" />
        </div>
        <div>
          <input {...register("subject")} placeholder="Subject" className="w-full rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <textarea {...register("message")} rows={5} placeholder="Message" className="w-full rounded-lg border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-sm" />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
      </div>
      <input type="hidden" {...register("sourcePage")} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

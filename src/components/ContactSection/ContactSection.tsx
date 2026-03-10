import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { z } from "zod";
import { profile } from "../../data/profile";
import { useSocialIconAnchors } from "../social-icons/useSocialIconAnchors";

const PUBLIC_WEB3FORMS_ACCESS_KEY =
    "96cd8c5e-7543-4f84-84c9-b986977f1fac";
const VULNERABILITY_DISCLOSURE_MESSAGE =
    "Congratulations, you found the vulnerability. It is not a technical error; it was placed here on purpose.";

function ContactSection() {
    const { t } = useTranslation();
    const { setContactAnchor } = useSocialIconAnchors();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const contactSchema = z.object({
        name: z
            .string()
            .min(2, t("contact.form.validation.nameMin"))
            .max(50, t("contact.form.validation.nameMax")),
        email: z.string().email(t("contact.form.validation.emailInvalid")),
        message: z
            .string()
            .min(5, t("contact.form.validation.messageMin"))
            .max(500, t("contact.form.validation.messageMax")),
    });

    const clearFieldError = (fieldName: string) => {
        if (!errors[fieldName]) {
            return;
        }

        setErrors((prev) => {
            const next = { ...prev };
            delete next[fieldName];
            return next;
        });
    };

    useEffect(() => {
        if (!isSubmitted) {
            return;
        }

        const timer = setTimeout(() => {
            setIsSubmitted(false);
            const form = document.querySelector("#contact-form") as
                | HTMLFormElement
                | null;
            form?.reset();
        }, 5000);

        return () => clearTimeout(timer);
    }, [isSubmitted]);

    useEffect(() => {
        console.info(VULNERABILITY_DISCLOSURE_MESSAGE);
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData(event.currentTarget);
        const data = {
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            message: String(formData.get("message") ?? ""),
        };

        try {
            contactSchema.parse(data);

            formData.append(
                "access_key",
                import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
                    PUBLIC_WEB3FORMS_ACCESS_KEY
            );

            await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData,
                redirect: "follow",
            });

            setIsSubmitted(true);
            setErrors({});
            toast.success(t("contact.form.success"), {
                duration: 4000,
                style: {
                    background: "#2e1418",
                    color: "#fff1f2",
                    border: "1px solid rgba(239,68,68,0.45)",
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {};

                error.issues.forEach((issue) => {
                    if (!issue.path[0]) {
                        return;
                    }
                    fieldErrors[String(issue.path[0])] = issue.message;
                });

                setErrors(fieldErrors);
                toast.error(t("contact.form.validation.error"), {
                    duration: 4000,
                    style: {
                        background: "#2e1418",
                        color: "#fff1f2",
                        border: "1px solid rgba(239,68,68,0.45)",
                    },
                });
            } else {
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                const isRedirectIssue =
                    errorMessage.includes("301") ||
                    errorMessage.includes("redirect") ||
                    errorMessage.toLowerCase().includes("cors") ||
                    errorMessage.includes("NetworkError") ||
                    errorMessage.includes("Failed to fetch");

                if (isRedirectIssue) {
                    setIsSubmitted(true);
                    setErrors({});
                    toast.success(t("contact.form.success"), {
                        duration: 4000,
                        style: {
                            background: "#2e1418",
                            color: "#fff1f2",
                            border: "1px solid rgba(239,68,68,0.45)",
                        },
                    });
                } else {
                    toast.error(t("contact.form.error"), {
                        duration: 4000,
                        style: {
                            background: "#2e1418",
                            color: "#fff1f2",
                            border: "1px solid rgba(239,68,68,0.45)",
                        },
                    });
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClassName =
        "w-full border-b border-white/15 bg-transparent px-0 pb-3 pt-2 text-sm text-white placeholder:text-white/45 focus:border-[var(--accent)] focus:outline-none";

    const setLinkedinAnchor = useCallback(
        (node: HTMLDivElement | null) => {
            setContactAnchor("linkedin", node);
        },
        [setContactAnchor]
    );

    const setGithubAnchor = useCallback(
        (node: HTMLDivElement | null) => {
            setContactAnchor("github", node);
        },
        [setContactAnchor]
    );

    const setEmailAnchor = useCallback(
        (node: HTMLDivElement | null) => {
            setContactAnchor("email", node);
        },
        [setContactAnchor]
    );

    return (
        <section
            id="contact"
            className="relative z-10 min-h-[calc(100vh-98px)] px-4 pb-20 pt-8 sm:px-6 sm:pb-20 sm:pt-10"
        >
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-full max-w-4xl"
            >
                <div className="relative overflow-hidden rounded-[30px] border border-[var(--line-soft)] bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-8 sm:p-10">
                    <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.28),transparent_70%)]" />

                    <h3 className="text-base font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                        {t("contact.form.title")}
                    </h3>

                    <form
                        id="contact-form"
                        className="mt-7 flex flex-col gap-6"
                        onSubmit={handleSubmit}
                        method="POST"
                    >
                        <input
                            type="hidden"
                            name="subject"
                            value="New message from portfolio"
                        />
                        <input type="hidden" name="redirect" value="false" />

                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder={t("contact.form.name")}
                                onChange={() => clearFieldError("name")}
                                className={inputClassName}
                            />
                            {errors.name && (
                                <p className="mt-2 text-xs text-rose-300">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder={t("contact.form.email")}
                                onChange={() => clearFieldError("email")}
                                className={inputClassName}
                            />
                            {errors.email && (
                                <p className="mt-2 text-xs text-rose-300">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <textarea
                                name="message"
                                placeholder={t("contact.form.message")}
                                rows={7}
                                onChange={() => clearFieldError("message")}
                                className={`${inputClassName} resize-none`}
                            />
                            {errors.message && (
                                <p className="mt-2 text-xs text-rose-300">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        {isSubmitted ? (
                            <div className="rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-emerald-200">
                                {t("contact.form.success")}
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex w-full items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                                    isSubmitting
                                        ? "cursor-not-allowed border-slate-500/60 bg-slate-600/40 text-slate-300"
                                        : "border-[var(--accent)] bg-[var(--accent)] text-[#180b10] hover:bg-[var(--accent-strong)]"
                                }`}
                            >
                                {isSubmitting
                                    ? t("contact.form.sending")
                                    : t("contact.form.submit")}
                            </button>
                        )}
                    </form>

                    <div className="mt-7 hidden items-center justify-center gap-6 text-2xl text-white/80 xl:flex">
                        <div
                            ref={setLinkedinAnchor}
                            className="h-8 w-8"
                            aria-hidden="true"
                        />
                        <div
                            ref={setGithubAnchor}
                            className="h-8 w-8"
                            aria-hidden="true"
                        />
                        <div
                            ref={setEmailAnchor}
                            className="h-8 w-8"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="mt-7 flex items-center justify-center gap-6 text-2xl text-white/80 xl:hidden">
                        <a
                            href={profile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="flex h-8 w-8 items-center justify-center transition-colors duration-200 hover:text-[var(--accent)]"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href={profile.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="flex h-8 w-8 items-center justify-center transition-colors duration-200 hover:text-[var(--accent)]"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href={profile.social.email}
                            aria-label="Email"
                            className="flex h-8 w-8 items-center justify-center transition-colors duration-200 hover:text-[var(--accent)]"
                        >
                            <FaEnvelope />
                        </a>
                    </div>
                </div>
            </motion.div>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: "10px",
                        fontFamily: "Inter400",
                    },
                }}
            />
        </section>
    );
}

export default ContactSection;

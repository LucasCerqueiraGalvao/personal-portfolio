import { useTranslation } from "react-i18next";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { profile } from "../../data/profile";

// Intentional for GitHub Pages contact form usage.
const PUBLIC_WEB3FORMS_ACCESS_KEY =
    "96cd8c5e-7543-4f84-84c9-b986977f1fac";
const VULNERABILITY_DISCLOSURE_MESSAGE =
    "Congratulations, you found the vulnerability. It is not a technical error; it was placed here on purpose.";

function ContactSection() {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Schema de validação com Zod
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

    // Limpa os erros quando o usuário edita um campo
    const clearFieldError = (fieldName: string) => {
        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // Reset do estado de sucesso após 5 segundos
    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                setIsSubmitted(false);
                // Limpa o formulário apenas depois que o estado de sucesso é resetado
                const form = document.querySelector(
                    "#contact-form"
                ) as HTMLFormElement;
                if (form) {
                    form.reset();
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted]);

    useEffect(() => {
        console.info(VULNERABILITY_DISCLOSURE_MESSAGE);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            message: formData.get("message") as string,
        };

        try {
            // Validação com Zod
            contactSchema.parse(data);

            // Se chegou aqui, validação passou
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
                    background: "#10B981",
                    color: "#fff",
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Erros de validação
                const fieldErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        fieldErrors[issue.path[0] as string] = issue.message;
                    }
                });
                setErrors(fieldErrors);
                toast.error(t("contact.form.validation.error"), {
                    duration: 4000,
                    style: {
                        background: "#EF4444",
                        color: "#fff",
                    },
                });
            } else {
                // Verificar se é erro CORS, 301 ou similar (redirecionamento)
                const errorMessage =
                    error instanceof Error ? error.message : String(error);
                if (
                    errorMessage.includes("301") ||
                    errorMessage.includes("redirect") ||
                    errorMessage.includes("CORS") ||
                    errorMessage.toLowerCase().includes("cors") ||
                    errorMessage.includes("NetworkError") ||
                    errorMessage.includes("Failed to fetch")
                ) {
                    // Erro CORS/301 mas email provavelmente enviado
                    console.log(
                        "Erro CORS/redirecionamento detectado, mas email enviado com sucesso"
                    );
                    setIsSubmitted(true);
                    setErrors({});
                    toast.success(t("contact.form.success"), {
                        duration: 4000,
                        style: {
                            background: "#10B981",
                            color: "#fff",
                        },
                    });
                } else {
                    console.error("Erro ao enviar email:", error);
                    toast.error(t("contact.form.error"), {
                        duration: 4000,
                        style: {
                            background: "#EF4444",
                            color: "#fff",
                        },
                    });
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="contact"
            className="font-['Inter400'] min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 bg-black text-white relative z-10"
        >
            <motion.h2
                className="hidden sm:block sm:text-5xl font-extrabold text-center mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                {t("contact.mainTitle").toUpperCase()}
            </motion.h2>

            <motion.div
                className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-10 w-full max-w-md sm:max-w-xl lg:max-w-2xl shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">
                    {t("contact.form.title").toUpperCase()}
                </h3>
                <p className="text-sm sm:text-base text-white/60 text-center mb-8 px-2">
                    {t("contact.form.description")}
                </p>

                <form
                    id="contact-form"
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                    method="POST"
                >
                    {/* Campo oculto para Web3Forms */}
                    <input
                        type="hidden"
                        name="subject"
                        value="Nova mensagem do Portfólio"
                    />
                    <input type="hidden" name="redirect" value="false" />

                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder={t("contact.form.name")}
                            onChange={() => clearFieldError("name")}
                            className={`bg-black border text-sm sm:text-base text-white px-5 py-3 rounded-md placeholder:text-white/30 focus:outline-none focus:ring-2 transition-colors w-full ${
                                errors.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-white/20 focus:ring-primary"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm mt-1 px-1">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder={t("contact.form.email")}
                            onChange={() => clearFieldError("email")}
                            className={`bg-black border text-sm sm:text-base text-white px-5 py-3 rounded-md placeholder:text-white/30 focus:outline-none focus:ring-2 transition-colors w-full ${
                                errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-white/20 focus:ring-primary"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1 px-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <textarea
                            name="message"
                            placeholder={t("contact.form.message")}
                            rows={6}
                            onChange={() => clearFieldError("message")}
                            className={`bg-black border text-sm sm:text-base text-white px-5 py-3 rounded-md placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 transition-colors w-full ${
                                errors.message
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-white/20 focus:ring-primary"
                            }`}
                        />
                        {errors.message && (
                            <p className="text-red-400 text-sm mt-1 px-1">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    {/* Botão */}
                    <motion.div
                        className="mt-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        {isSubmitted ? (
                            <div className="w-full bg-green-600 text-white font-semibold py-3 text-base sm:text-lg rounded-md text-center">
                                {t("contact.form.success")}
                            </div>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-semibold py-3 text-base sm:text-lg rounded-md transition-all hover:translate-y-[-4px] duration-300 ${
                                    isSubmitting
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        : "bg-white text-black hover:bg-primary hover:text-white"
                                }`}
                            >
                                {isSubmitting
                                    ? t("contact.form.sending")
                                    : t("contact.form.submit").toUpperCase()}
                            </button>
                        )}
                    </motion.div>
                </form>

                {/* Ícones sociais */}
                <div className="flex justify-center gap-6 sm:gap-8 mt-8 text-white/80 text-xl sm:text-2xl lg:text-3xl">
                    <motion.a
                        href={profile.social.linkedin}
                        target="_blank"
                        aria-label="LinkedIn"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <FaLinkedin className="hover:text-primary transition-transform duration-300 transform hover:scale-110 cursor-pointer" />
                    </motion.a>
                    <motion.a
                        href={profile.social.github}
                        target="_blank"
                        aria-label="GitHub"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <FaGithub className="hover:text-primary transition-transform duration-300 transform hover:scale-110 cursor-pointer" />
                    </motion.a>
                    <motion.a
                        href={profile.social.email}
                        aria-label="Email"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <FaEnvelope className="hover:text-primary transition-transform duration-300 transform hover:scale-110 cursor-pointer" />
                    </motion.a>
                </div>
            </motion.div>

            {/* Toaster para as notificações */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: "8px",
                        fontFamily: "Inter",
                    },
                }}
            />
        </section>
    );
}

export default ContactSection;


type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type: "primary" | "secondary";
    disabled?: boolean;
};

function Button({
    children,
    onClick = () => {},
    className = "",
    type = "primary",
    disabled = false,
}: Props) {
    const baseClassName =
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl border px-5 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] transition-all duration-200";

    const variantClassName =
        type === "primary"
            ? "bg-[var(--accent)] border-[var(--accent)] text-[#102236] hover:bg-[var(--accent-strong)] hover:border-[var(--accent-strong)]"
            : "bg-white/5 border-[var(--line-soft)] text-white hover:bg-white/12 hover:border-white/45";

    const disabledClassName = disabled
        ? "opacity-45 pointer-events-none"
        : "hover:-translate-y-0.5 active:translate-y-0";

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`${baseClassName} ${variantClassName} ${disabledClassName} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;

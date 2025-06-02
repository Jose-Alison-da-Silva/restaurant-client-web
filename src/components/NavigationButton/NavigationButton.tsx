type NavigationButtonProps = {
  title: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function NavigationButton({
  title,
  onClick,
  variant = "primary",
  className,
}: NavigationButtonProps) {
  const baseClasses =
    "px-8 py-4 rounded-lg font-bold font-roboto text-lg uppercase tracking-wide transition-all duration-200 hover:scale-105 active:scale-95";

  const variantClasses = {
    primary:
      "bg-vermelho-principal hover:bg-red-800 text-white shadow-lg border-2 border-red-600",
    secondary:
      "bg-amarelo-principal hover:bg-yellow-600 text-red-800 shadow-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {title}
    </button>
  );
}

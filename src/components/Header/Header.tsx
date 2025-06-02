import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png";

type HeaderProps = {
  showBackButton?: boolean;
  onBackClick?: () => void;
};

export default function Header({
  showBackButton = false,
  onBackClick,
}: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-vermelho-principal text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="mr-4 p-2 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-12 h-12" />
          </button>
        )}
      </div>

      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="mx-auto w-16 h-16" />
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-amarelo-principal font-roboto text-sm font-medium">
            USUÁRIO
          </p>
          <p className="text-white font-roboto text-sm">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-vermelho-principal px-4 py-2 rounded-lg font-roboto text-sm font-medium transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>
    </header>
  );
}

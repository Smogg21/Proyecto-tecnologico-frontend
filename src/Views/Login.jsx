import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const goToOperador = () => {
    navigate("/vistaOperador");
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={goToOperador}>Log In</button>
    </div>
  );
};

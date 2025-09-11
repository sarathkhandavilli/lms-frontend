import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const role = params.get("role");
    const userId = params.get("userId");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");

    if (token && role) {
      // Save details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);

      // Redirect by role
      switch (role.toUpperCase()) {
        case "LEARNER":
          navigate("/learner", { replace: true });
          break;
        case "MENTOR":
          navigate("/mentor", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;
        default:
          navigate("/", { replace: true });
      }
    } else {
      // If no token → back to home
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return null; // 🔑 No UI, only handles redirect
};

export default RedirectHandler;

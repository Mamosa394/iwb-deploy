import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import "../styles/LoadingScreen.css";
import robotImage from "/images/ROBOT.png";
import { FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loader">
      <div></div><div></div><div></div><div></div>
    </div>
    <p>Logging you in, please wait...</p>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "client", // default
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://backend-8-gn1i.onrender.com/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { user } = response.data;

      // Confirm selected role matches the actual user role
      if (user.role !== formData.role) {
        setError(`Role mismatch. You are registered as "${user.role}".`);
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      redirectBasedOnRole(user.role);

    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred. Please try again.");
      }
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "sales":
        navigate("/sales-dashboard");
        break;
      case "finance":
        navigate("/income-statements");
        break;
      case "investor":
        navigate("/net-income");
        break;
      default:
        navigate("/home-page");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="login-page-body">
      <div className="login-page-container">
        <div className="login-page-left-panel-container">
          <div className="login-page-left-panel">
            <div className="login-page-robot-container">
              <img src={robotImage} alt="Robot" className="login-page-robot-img" />
              <p className="login-page-knee-caption">
                YOUR IDEAS START HERE!
                <br />
                LOG IN TO MAKE THEM REAL.
              </p>
            </div>
          </div>
        </div>

        <div className="login-page-right-panel-container">
          <div className="login-page-right-panel">
            <div className="login-page-signup-form-box">
              <div className="login-page-glow-border"></div>
              <h2>Welcome back</h2>
              <p className="login-page-login-text">
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>

              {error && <p className="login-page-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="login-page-input-wrapper">
                  <FaEnvelope className="login-page-input-icon" />
                  <input
                    type="email"
                    className="login-page-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="login-page-input-wrapper">
                  <FaLock className="login-page-input-icon" />
                  <input
                    type="password"
                    className="login-page-input"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="login-page-input-wrapper">
                  <FaUserTag className="login-page-input-icon" />
                  <select
                    name="role"
                    className="login-page-input"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="client">Client</option>
                    <option value="sales">Sales</option>
                    <option value="finance">Finance</option>
                    <option value="admin">Admin</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="login-page-signup-btn"
                  disabled={loading}
                >
                  Login
                </button>
              </form>

              <div className="login-page-footer">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect } from "react";
import { Button, Form, Offcanvas, Container, Dropdown } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, checkAuthStatusAsync, logout } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";

function OffCanvas() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, isAuthenticated, error, loading } = useSelector((state) => state.user);

  const [showLogin, setShowLogin] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
    setValue,
  } = useForm();

  useEffect(() => {
    dispatch(checkAuthStatusAsync());
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      console.log("登入中...");
    } else if (error) {
      toast.error(error);
    } else if (isAuthenticated) {
      toast.success("登入成功！");
      setShowLogin(false); // Close login modal after successful login
    }
  }, [userName, isAuthenticated, error, loading]);

  const handleLoginFormSubmit = async (data) => {
    dispatch(loginUser(data.loginEmail, data.loginPassword));
  };

  const handleLogout = async () => {
    dispatch(logout());
    toast.success("已登出！");
  };
  const handleProdList = async () => {
    if (isAuthenticated) {
      navigate("/admin");
      toast.success("已進入產品列表！");
    }
  };

  const handleDemoLogin = () => {
    const demoEmail = "";
    const demoPassword = "";
    setValue("loginEmail", demoEmail);
    setValue("loginPassword", demoPassword);
    handleLoginSubmit(handleLoginFormSubmit)();
    setShowLogin(false);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex align-items-center">
        <ul className="d-none d-md-block list-unstyled d-md-flex align-items-md-center">
          {isAuthenticated ? (
            <>
              <li className="fs-5 fw-semibold me-2 text-gary-500">{userName}  先生/小姐，您好</li>
              <li className="ms-10">
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    className="rounded-circle border-3 border-brown  text-brown hover-bg-brown"
                    id="dropdown-user-menu"
                  >
                    <i className="bi bi-person fs-5"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="mt-2">
                    <Dropdown.Item onClick={handleProdList}>產品列表</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>登出</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </>
          ) : (
            <li>
              <Button
                className="border-0 bg-tertiary-500 text-white rounded-pill login-button"
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  resetLoginForm();
                  setShowLogin(true);
                }}
              >
                後台登入
              </Button>
            </li>
          )}
        </ul>
      </div>

      {/* Login Form */}
      <Offcanvas show={showLogin} onHide={() => setShowLogin(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="h3 text-center">登入</div>
          <Form onSubmit={handleLoginSubmit(handleLoginFormSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="email@example.com"
                autoComplete="email"
                {...loginRegister("loginEmail", {
                  required: "Email 必填",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email 格式錯誤",
                  },
                })}
              />
              {loginErrors.loginEmail && (
                <span className="text-danger">{loginErrors.loginEmail.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>密碼</Form.Label>
              <Form.Control
                type="password"
                placeholder="password"
                autoComplete="current-password"
                {...loginRegister("loginPassword", { required: "密碼必填" })}
              />
              {loginErrors.loginPassword && (
                <span className="text-danger">{loginErrors.loginPassword.message}</span>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "登入中..." : "登入"}
            </Button>

            <div className="text-center mt-3">
              <a href="#" onClick={handleDemoLogin} className="btn btn-link">
                Demo登入
              </a>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer />
    </Container>
  );
}

export default OffCanvas;

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import OffCanvas from "../component/OffCanvas";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, userName } = useSelector((state) => state.user);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      console.log("not logged in.");
    } else {
      console.log("Already logged in.");
      navigate("/"); // Logo 點擊後跳轉到首頁
    }
  };

  return (
    <div className="header pt-20 pb-6 py-md-6">
      <nav className="header-container d-flex justify-content-between align-items-center">
        {/* 使用 Link 來處理導航到首頁 */}
        <Link className="m-0 p-0" to="/" onClick={handleLogoClick}>
          <picture>
            <source srcSet="/images/logo/dessert.png" media="(max-width: 767px)" />
            <img className="img-fluid header-logo" src="/images/logo/dessert.png" alt="banner" />
          </picture>
        </Link>
        <div className="d-flex align-items-center">
          <OffCanvas isAuthenticated={isAuthenticated} userName={userName} />
        </div>
      </nav>
    </div >
  );
}

export default Header;
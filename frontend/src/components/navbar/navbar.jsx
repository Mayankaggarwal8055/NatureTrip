import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./navbar.module.css";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const paidCount = user?.travellers
    ? user.travellers.filter(t => t.status?.toLowerCase() === "paid").length
    : 0;

  const handleBadgeClick = () => {
    navigate("/Profile/Badges");
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.leaf}>🌿</span> Nature Trip
      </NavLink>

      {isAuthenticated && (
        <div
          className={styles.treeBadge}
          onClick={handleBadgeClick}
          title="View your earned badges 🌿"
        >
          Hey {user?.profile?.firstName || user?.name || "Traveller"} 🌱, you’ve planted{" "}
          <strong>{paidCount}</strong> {paidCount === 1 ? "tree" : "trees"}!
        </div>
      )}

      <div className={styles.navLinks}>

        {isAuthenticated ? (
          <NavLink to="/Profile" className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`}>
            Profile
          </NavLink>
        ) : (
          <button className={styles.loginBtn} onClick={() => navigate("/login")}>
            Login / Signup
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

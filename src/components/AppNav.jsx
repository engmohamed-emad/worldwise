/*eslint-disable no-unused-vars */
import styles from "./AppNav.module.css";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="cities">cities</NavLink>
        </li>
        <li>
          <NavLink to="countries">countries</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;

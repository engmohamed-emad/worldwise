import PageNav from "../components/PageNav";
import { Link } from "react-router-dom";
import AppLayout from "./AppLayout";

function HomePage() {
  return (
    <div>
      <PageNav />
      <AppLayout />
      <h1>worldwise</h1>
      <Link to="/app">Go to app</Link>
    </div>
  );
}

export default HomePage;

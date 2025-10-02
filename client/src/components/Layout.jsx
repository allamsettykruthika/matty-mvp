import Navbar from "./Navbar.jsx";

export default function Layout({ children, theme, setTheme }) {
  return (
    <div>
      <Navbar theme={theme} setTheme={setTheme} />
      <main style={{ paddingTop: "70px" }}>{children}</main>
    </div>
  );
}

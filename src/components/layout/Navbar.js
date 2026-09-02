function Navbar({ token, onLogout }) {
  return (
    <nav>
      <h2>Micro Task Manager</h2>

      {token && (
        <div>
          <a href="/">Tasks</a>

          <button onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
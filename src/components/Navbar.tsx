const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div>
        <button className="bg-gray-200 px-4 py-2 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

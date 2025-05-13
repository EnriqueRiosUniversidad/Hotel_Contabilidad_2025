import Sidebar from "./components/Sidebar";

function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        {/* Pantalla principal vacía */}
      </div>
    </div>
  );
}

export default Home;

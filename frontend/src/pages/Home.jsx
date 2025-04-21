import Navbar from '../components/Navbar';

function Home() {
  return (
    <div className="d-flex">
      <Navbar />
      <div className="flex-grow-1 p-4">
        <h1>Bienvenido al Sistema Contable</h1>
        <p>Aquí puedes gestionar tus libros, balances y más.</p>
      </div>
    </div>
  );
}

export default Home;

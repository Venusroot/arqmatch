import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Principal';
import Sobre from './Sobre';
import Projetos from './Projetos';
import Login from './Login';
import Cadastro from './Cadastro';
import Carrinho from './Carrinho';
import ProtectedRoute from './ProtectedRoute';
import Pedidos from './Pedidos';
import Contato from './Contato';
import Checkout from './Checkout';

function App() {
  return (
    <BrowserRouter>
      {/* Configuração das páginas/módulos que serão trocados dinamicamente */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/Sobre" element={<Sobre />} />
        <Route path="/Projetos" element={<Projetos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/carrinho"
          element={
            <ProtectedRoute>
              <Carrinho />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
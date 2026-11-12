import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import './Carrinho.css';
import { useCart } from './context/useCart';

function Carrinho() {
  const { items, removeItem, total } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page">
      <Header />
      <section className="cart-content" aria-labelledby="cart-title">
        <h1 id="cart-title">Meu carrinho</h1>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Seu carrinho está vazio.</p>
            <Link className="cart-link" to="/projetos">
              Continuar explorando projetos
            </Link>
          </div>
        ) : (
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={item.projectId}>
                {item.image && <img src={item.image} alt="" />}
                <div className="cart-item-info">
                  <h2>{item.title}</h2>
                  <p>Quantidade: {item.quantity}</p>
                  <p>
                    {item.price === undefined
                      ? 'Preço não disponível para este item antigo.'
                      : `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} por projeto`}
                  </p>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  onClick={() => removeItem(item.projectId)}
                >
                  Remover
                </button>
              </article>
            ))}
            <div className="cart-total">
              <span>Total para pagamento</span>
              <strong>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
              </strong>
            </div>
            <button className="auth-submit" type="button" onClick={() => navigate('/checkout')}>
              Ir para checkout
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Carrinho;

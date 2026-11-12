import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import './Checkout.css';
import { useAuth } from './context/useAuth';
import { useCart } from './context/useCart';
import { orderService } from './services/orders';

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function Checkout() {
  const { currentUser } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser || items.length === 0) return;

    setError('');
    setIsSubmitting(true);
    try {
      orderService.create(currentUser.id, items);
      clearCart();
      navigate('/pedidos');
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Não foi possível simular o pagamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="checkout-page">
      <Header />
      <section className="checkout-content" aria-labelledby="checkout-title">
        <h1 id="checkout-title">Checkout</h1>
        {items.length === 0 ? (
          <div className="checkout-empty">
            <p>Seu carrinho está vazio.</p>
            <Link className="cart-link" to="/projetos">Voltar aos projetos</Link>
          </div>
        ) : (
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <p className="checkout-note">Simulação de pagamento — nenhum dado será enviado ou cobrado.</p>
              <label htmlFor="card-name">Nome no cartão</label>
              <input id="card-name" required placeholder="Nome completo" />
              <label htmlFor="card-number">Número do cartão</label>
              <input id="card-number" inputMode="numeric" required placeholder="0000 0000 0000 0000" />
              <div className="checkout-row">
                <div><label htmlFor="card-expiry">Validade</label><input id="card-expiry" required placeholder="MM/AA" /></div>
                <div><label htmlFor="card-cvv">CVV</label><input id="card-cvv" required placeholder="000" /></div>
              </div>
              {error && <p className="auth-error" role="alert">{error}</p>}
              <button className="auth-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processando...' : 'Simular pagamento'}
              </button>
            </form>
            <aside className="checkout-summary">
              <h2>Resumo do pedido</h2>
              {items.map((item) => <p key={item.projectId}>{item.title} <strong>{formatCurrency((item.price ?? 0) * item.quantity)}</strong></p>)}
              <div><span>Total</span><strong>{formatCurrency(total)}</strong></div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Checkout;

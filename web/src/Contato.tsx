import { useState } from 'react';
import type { FormEvent } from 'react';
import Header from './Header';
import './Contato.css';

function Contato() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">
      <Header />
      <section className="contact-content" aria-labelledby="contact-title">
        <div className="contact-intro">
          <span className="projetos-tag">Fale conosco</span>
          <h1 id="contact-title">Vamos conversar sobre seu próximo projeto?</h1>
          <p>Envie uma mensagem fictícia para a equipe ArqMatch. Em uma versão futura, este formulário poderá ser ligado a um serviço de atendimento.</p>
        </div>
        {submitted ? (
          <div className="contact-success" role="status">
            <h2>Mensagem enviada!</h2>
            <p>Obrigado pelo contato. Nossa equipe responderia em breve.</p>
            <button type="button" className="contact-submit" onClick={() => setSubmitted(false)}>
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Nome</label>
            <input id="contact-name" name="name" required placeholder="Seu nome" />
            <label htmlFor="contact-email">E-mail</label>
            <input id="contact-email" name="email" type="email" required placeholder="voce@email.com" />
            <label htmlFor="contact-message">Mensagem</label>
            <textarea id="contact-message" name="message" required rows={5} placeholder="Como podemos ajudar?" />
            <button className="contact-submit" type="submit">Enviar mensagem</button>
          </form>
        )}
      </section>
    </main>
  );
}

export default Contato;

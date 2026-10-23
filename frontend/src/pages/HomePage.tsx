export function HomePage() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">SEU NEGÓCIO. UM NOVO HORIZONTE.</p>
        <h1 id="hero-title">
          Gestão financeira <br />
          para quem <em>empreende.</em>
        </h1>
        <p className="hero-description">
          Uma plataforma para simplificar o controle financeiro de lojas e
          pequenos negócios.
        </p>
        <div className="coming-soon">
          <span className="coming-icon" aria-hidden="true">
            ↗
          </span>
          <div>
            <strong>Estamos preparando o próximo passo.</strong>
            <p>
              O Finora está em desenvolvimento. Em breve, mais clareza para as
              finanças do seu negócio.
            </p>
          </div>
        </div>
        <p className="hero-note">
          Mais clareza. Mais confiança. Mais espaço para crescer.
        </p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-grid" />
        <div className="art-label">ESPAÇO PARA CRESCER</div>
        <svg className="growth-line" viewBox="0 0 400 400" fill="none">
          <path
            d="M45 325C105 325 80 255 150 255S180 190 235 190S280 115 355 90"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="355" cy="90" r="7" fill="currentColor" />
          <path d="M45 350H355" stroke="currentColor" strokeOpacity=".2" />
        </svg>
        <div className="art-caption">
          <span>01 / UM NOVO COMEÇO</span>
          <span>FINORA ↗</span>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="eyebrow">404</p>
      <h1>Página não encontrada</h1>
      <p>Vamos voltar ao começo?</p>
      <Link to="/">Ir para o início →</Link>
    </section>
  )
}

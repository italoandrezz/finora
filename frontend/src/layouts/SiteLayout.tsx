import { Link, Outlet } from 'react-router'
import { Brand } from '../components/Brand'

export function SiteLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header">
        <Link to="/" aria-label="Finora — início">
          <Brand />
        </Link>
        <span className="status">
          <span aria-hidden="true" />
          Em desenvolvimento
        </span>
      </header>
      <main id="conteudo">
        <Outlet />
      </main>
      <footer className="site-footer">
        <span>Finora © {new Date().getFullYear()}</span>
        <span>Feito para o seu próximo passo.</span>
      </footer>
    </div>
  )
}

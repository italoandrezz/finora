import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { SiteLayout } from '../layouts/SiteLayout'
import { HomePage } from './HomePage'
import { NotFoundPage } from './NotFoundPage'

function renderRoute(path: string) {
  const router = createMemoryRouter(
    [
      {
        element: <SiteLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  return render(<RouterProvider router={router} />)
}

describe('rotas públicas', () => {
  it('apresenta a proposta e informa que o produto está em desenvolvimento', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Gestão financeira para quem empreende.',
    )
    expect(screen.getByText('Em desenvolvimento')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Finora — início' }),
    ).toHaveAttribute('href', '/')
  })

  it('oferece um caminho de volta para rotas inexistentes', () => {
    renderRoute('/inexistente')
    expect(
      screen.getByRole('heading', { name: 'Página não encontrada' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Ir para o início/ }),
    ).toHaveAttribute('href', '/')
  })
})

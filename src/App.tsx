import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { ProductsPage } from './pages/ProductsPage'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products/:id" element={<div>Detail Page (coming soon)</div>} />
          <Route path="/products/:id/edit" element={<div>Edit Page (coming soon)</div>} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App

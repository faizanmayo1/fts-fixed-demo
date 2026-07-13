import { Routes, Route, useNavigate } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ToastProvider } from './components/Toast'
import { CommandCenter } from './screens/CommandCenter'
import { ServiceOrder } from './screens/ServiceOrder'
import { Parts } from './screens/Parts'
import { Warranty } from './screens/Warranty'
import { Technicians } from './screens/Technicians'
import { Copilot } from './screens/Copilot'

function CopilotRoute() {
  const navigate = useNavigate()
  return <Copilot onNavigate={(to) => navigate(to)} />
}

export default function App() {
  return (
    <ToastProvider>
      <Shell>
      <Routes>
        <Route path="/" element={<CommandCenter />} />
        <Route path="/order" element={<ServiceOrder />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/copilot" element={<CopilotRoute />} />
      </Routes>
      </Shell>
    </ToastProvider>
  )
}

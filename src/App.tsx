import './App.css'
import ArenaWithBull from './components/ArenaWithBull'
import { Matador } from './components/Matador'
import { OldMatador } from './components/OldMatador'

function App() {
  return (
    <div className="App">
      <ArenaWithBull
        matador={<Matador />} />
    </div>
  )
}

export default App

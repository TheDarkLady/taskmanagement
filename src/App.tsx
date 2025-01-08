import './App.css'
import { ModeToggle } from './components/mode-toggle'
import { Button } from "./components/ui/button"

function App() {

  return (
    <>
      <div className='flex flex-col gap-4 items-center justify-center h-screen'>
        <h3 className='font-bold text-2xl'>Hello</h3>
        <Button>Button</Button>
        <ModeToggle />
      </div>
    </>
  )
}

export default App

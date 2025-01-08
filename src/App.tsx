import './App.css'
import { ModeToggle } from './components/mode-toggle'
import { Button } from "./components/ui/button"
import Navbar from './views/Navbar'

function App() {

  return (
    <>
      <Navbar/>
      <div className='flex flex-col gap-4 items-center justify-center h-full'>
        <h3 className='font-bold text-2xl'>Hello</h3>
        <Button>Button</Button>
        <ModeToggle />
      </div>
    </>
  )
}

export default App

import './App.css'
import { Button } from "./components/ui/button"

function App() {

  return (
    <>
      <div className='flex flex-col gap-2 items-center justify-center h-screen'>
        <h3 className='font-bold text-2xl'>Hello</h3>
        <Button>Button</Button>
      </div>
    </>
  )
}

export default App

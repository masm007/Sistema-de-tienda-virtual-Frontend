import { useState } from 'react'
import {MainLayout} from "./layout/MainLayout.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MainLayout></MainLayout>
    </>
  )
}

export default App

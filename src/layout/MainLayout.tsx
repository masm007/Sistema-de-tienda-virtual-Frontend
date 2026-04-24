import React from 'react'
import { Login } from "../features/auth/Login.tsx"

type Props = {}

export const MainLayout = (props: Props) => {
  return (
    <>
      <Login></Login>
    </>
  )
}
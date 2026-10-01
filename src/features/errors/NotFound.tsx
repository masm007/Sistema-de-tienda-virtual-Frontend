import { Box, Typography } from '@mui/material'
import React from 'react'

type Props = {}

export const NotFound = (props: Props) => {
  return (
    <Box sx={{display: "flex", flexDirection: "column"}}>
        <Typography variant='h1'>404</Typography>
        <Typography variant='body2'>Página no encontrada</Typography>
        <Typography variant='body2'>Oooops!!!</Typography>
    </Box>
  )
}
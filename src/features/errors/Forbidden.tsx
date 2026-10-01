import { Box, Typography } from '@mui/material'
import React from 'react'

type Props = {}

export const Forbidden = (props: Props) => {
  return (
    <Box sx={{display: "flex", flexDirection: "column"}}>
        <Typography variant='h1'>403</Typography>
        <Typography variant='body2'>No tienes permiso para acceder a esta página</Typography>
    </Box>
  )
}
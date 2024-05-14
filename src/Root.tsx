import React from 'react'
import { Route } from 'react-router-dom'
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui'
import { RecoilRoot } from 'recoil'
import HomePage from './pages/HomePage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const MyApp = () => {
  return (
    <RecoilRoot>
      <App>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path='/' Component={HomePage}></Route>
              </AnimationRoutes>
            </ZMPRouter>
          </SnackbarProvider>
        </QueryClientProvider>
      </App>
    </RecoilRoot>
  )
}
export default MyApp

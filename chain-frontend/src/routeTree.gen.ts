/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as NamespaceIndexImport } from './routes/$namespace/index'
import { Route as NamespaceChainIdImport } from './routes/$namespace/$chainId'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const NamespaceIndexRoute = NamespaceIndexImport.update({
  path: '/$namespace/',
  getParentRoute: () => rootRoute,
} as any)

const NamespaceChainIdRoute = NamespaceChainIdImport.update({
  path: '/$namespace/$chainId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/$namespace/$chainId': {
      preLoaderRoute: typeof NamespaceChainIdImport
      parentRoute: typeof rootRoute
    }
    '/$namespace/': {
      preLoaderRoute: typeof NamespaceIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  NamespaceChainIdRoute,
  NamespaceIndexRoute,
])

/* prettier-ignore-end */

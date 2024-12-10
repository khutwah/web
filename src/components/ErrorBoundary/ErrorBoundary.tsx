'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  // Static method to derive state from error
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  // Lifecycle method to handle error logging
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Optional custom error logging
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Optionally log to console or error tracking service
    console.error('Uncaught error:', error, errorInfo)
  }

  // Method to reset error state
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    // If an error has occurred, render fallback
    if (this.state.hasError) {
      // Use custom fallback or default error message
      return (
        this.props.fallback || (
          <div role='alert'>
            <h1>Something went wrong</h1>
            <p>{this.state.error?.message}</p>
            <button onClick={this.resetErrorBoundary}>Try again</button>
          </div>
        )
      )
    }

    // Render children normally when no error
    return this.props.children
  }
}

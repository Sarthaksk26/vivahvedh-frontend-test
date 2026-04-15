import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<<PropsProps, State> {
  public state: State = { hasError: false };
  public static getDerivedStateFromError(_: Error): State { return { hasError: true }; }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo, _: any) { console.error(error, errorInfo); }
  public render() {
    if (this.state.hasError) return <<divdiv className="p-4 text-center text-red-500 font-bold">Something went wrong. Please refresh the page.</div>;
    return this.props.children;
  }
}
export default ErrorBoundary;

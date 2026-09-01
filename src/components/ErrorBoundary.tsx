import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 mx-auto max-w-lg bg-[#141414] border border-red-500/40 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-white uppercase">
              {this.props.fallbackTitle || 'Ops, algo não carregou como esperado'}
            </h3>
            <p className="text-xs text-white/70">
              Ocorreu uma pequena instabilidade temporária. Você pode tentar novamente com segurança.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-[#E52521] hover:bg-[#c91d1a] text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Recarregar Opção</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

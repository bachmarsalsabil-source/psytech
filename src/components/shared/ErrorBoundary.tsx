import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { GoldButton } from '../clinic/GoldButton';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  declare props: React.PropsWithChildren;
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-psy-bg flex items-center justify-center p-6" dir="rtl">
          <div className="glass max-w-md w-full p-8 text-center space-y-6" role="alert">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400">
              <AlertTriangle size={32} aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-black text-psy-text mb-0">حدث خطأ غير متوقع</h1>
              <p className="text-sm text-psy-text/50 mb-0">
                نعتذر عن الإزعاج. يرجى إعادة تحميل الصفحة أو العودة للرئيسية.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GoldButton onClick={() => window.location.reload()} className="w-full sm:w-auto">
                إعادة التحميل
              </GoldButton>
              <Link to="/" className="w-full sm:w-auto">
                <GoldButton variant="secondary" className="w-full">
                  الرئيسية
                </GoldButton>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

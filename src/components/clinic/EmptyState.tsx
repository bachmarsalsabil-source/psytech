import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GoldButton } from './GoldButton';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center space-y-6" role="status">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-psy-text/20">
        <Icon size={40} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-psy-text/80">{title}</h3>
        <p className="text-sm text-psy-text/40 max-w-xs mx-auto">{description}</p>
      </div>
      {actionText && onAction && (
        <GoldButton onClick={onAction} variant="secondary" size="sm">
          {actionText}
        </GoldButton>
      )}
    </div>
  );
};

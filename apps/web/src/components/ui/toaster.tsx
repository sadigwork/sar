'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const normalizedTitle =
          title && typeof title === 'object' ? JSON.stringify(title) : title;
        const normalizedDescription =
          description && typeof description === 'object'
            ? JSON.stringify(description)
            : description;

        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {normalizedTitle && <ToastTitle>{normalizedTitle}</ToastTitle>}
              {normalizedDescription && (
                <ToastDescription>{normalizedDescription}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

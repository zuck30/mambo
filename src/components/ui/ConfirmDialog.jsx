import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center space-x-4 mb-4">
          <div className={cn(
            "p-3 rounded-xl",
            variant === 'danger' ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
          )}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-navy">{title}</h3>
        </div>

        <p className="text-gray-500 mb-8">{message}</p>

        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center",
              variant === 'danger' ? "bg-danger hover:bg-danger-dark" : "bg-warning hover:bg-warning-dark"
            )}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

import React from 'react';

interface ToastProps {
  toastMessage: string;
}

const Toast: React.FC<ToastProps> = ({ toastMessage }) => {
  if (!toastMessage) {
    return null;
  }

  return (
    <div className="toast" style={{ opacity: 1, bottom: '0' }}>{toastMessage}</div>
  );
};

export default Toast;

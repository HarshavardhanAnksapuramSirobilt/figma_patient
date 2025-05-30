// Simple toast utility for notifications
// In a real app, you might use react-toastify or another library

let toastContainer: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (toastContainer) return;
  
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
  `;
  document.body.appendChild(toastContainer);
};

const createToast = (message: string, type: 'success' | 'error' | 'info') => {
  createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    padding: 12px 16px;
    margin-bottom: 10px;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    max-width: 300px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
    animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
    opacity: 0;
    animation-fill-mode: forwards;
  `;
  
  // Set background color based on type
  if (type === 'success') {
    toast.style.backgroundColor = '#4CAF50';
  } else if (type === 'error') {
    toast.style.backgroundColor = '#F44336';
  } else {
    toast.style.backgroundColor = '#2196F3';
  }
  
  toast.textContent = message;
  toastContainer?.appendChild(toast);
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(-20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
};

export const showSuccess = (message: string, title?: string) => {
  createToast(title ? `${title}: ${message}` : message, 'success');
};

export const showError = (message: string, title?: string) => {
  createToast(title ? `${title}: ${message}` : message, 'error');
};

export const showInfo = (message: string, title?: string) => {
  createToast(title ? `${title}: ${message}` : message, 'info');
};
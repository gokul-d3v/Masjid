import useAuthStore from '../store/authStore';
import './Toast.css';

const Toast = () => {
  const { toast, hideToast } = useAuthStore();

  if (!toast.show) return null;

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={hideToast}>×</button>
      </div>
      <div 
        className="toast-progress" 
        style={{ 
          animation: `progress ${toast.duration}ms linear` 
        }}
      />
    </div>
  );
};

export default Toast;
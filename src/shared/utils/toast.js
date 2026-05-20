import { toast } from 'react-hot-toast';

const baseStyle = {
  borderRadius: '12px',
  fontWeight: 700,
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  padding: '14px 20px',
  boxShadow: '4px 4px 0px #000',
  background: '#181b21',
  color: '#F5F5F7',
  border: '3px solid #000',
};

export const showSuccess = (message) =>
  toast.success(message, {
    style: { ...baseStyle, borderColor: '#F1D302' },
    iconTheme: { primary: '#F1D302', secondary: '#111317' },
  });

export const showError = (message) =>
  toast.error(message, {
    style: { ...baseStyle, borderColor: '#C1292E' },
    iconTheme: { primary: '#C1292E', secondary: '#FFFFFF' },
  });

export const showInfo = (message) =>
  toast(message, {
    style: { ...baseStyle, borderColor: '#F1D302' },
    iconTheme: { primary: '#F1D302', secondary: '#111317' },
  });

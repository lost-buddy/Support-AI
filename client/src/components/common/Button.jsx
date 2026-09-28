// src/components/common/Button.jsx

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = { primary: 'primary-button', secondary: 'secondary-button', icon: 'icon-button', ghost: 'ghost-button' };
  const baseClass = variants[variant] || variants.primary;
  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

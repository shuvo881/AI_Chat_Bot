import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  variant = 'default',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  title,
  ariaLabel,
  form,
  name,
  value,
  destructive = false,
  rounded = 'md',
  tooltip,
  active = false,
  onMouseEnter,
  onMouseLeave,
}, ref) => {
  // Base styles that apply to all buttons
  const baseStyles = `
    inline-flex
    items-center
    justify-center
    font-medium
    transition-all
    duration-200
    select-none
    focus:outline-none
    focus-visible:ring-2
    focus-visible:ring-offset-2
    active:translate-y-px
    disabled:pointer-events-none
    disabled:opacity-50
  `;

  // Variant styles
  const variants = {
    default: `
      ${destructive 
        ? 'bg-red-500 hover:bg-red-600 focus-visible:ring-red-500 text-white' 
        : 'bg-blue-500 hover:bg-blue-600 focus-visible:ring-blue-500 text-white'
      }
    `,
    outline: `
      border
      ${destructive 
        ? 'border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950' 
        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
      }
    `,
    ghost: `
      ${destructive 
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    `,
    link: `
      underline-offset-4 hover:underline
      ${destructive 
        ? 'text-red-500' 
        : 'text-blue-500'
      }
    `,
    icon: `
      p-2 aspect-square
      ${destructive 
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950' 
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    `
  };

  // Size styles
  const sizes = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4'
  };

  // Border radius styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  // Determine the correct size class
  const sizeClass = variant === 'icon' ? sizes[size].split(' ')[0] : sizes[size];

  // Handle loading state content
  const content = loading ? (
    <>
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="ml-2">{children}</span>
    </>
  ) : (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizeClass}
        ${roundedStyles[rounded]}
        ${fullWidth ? 'w-full' : ''}
        ${active ? 'ring-2 ring-offset-2' : ''}
        ${className}
      `}
      title={tooltip || title}
      aria-label={ariaLabel || title}
      form={form}
      name={name}
      value={value}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-state={active ? 'active' : 'inactive'}
    >
      {content}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['default', 'outline', 'ghost', 'link', 'icon']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  title: PropTypes.string,
  ariaLabel: PropTypes.string,
  form: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  destructive: PropTypes.bool,
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  tooltip: PropTypes.string,
  active: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

Button.displayName = 'Button';

export default Button;
import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
    return (
        <div className='button' onClick={onClick}>
            {children}
        </div>
    );
};

export default Button;
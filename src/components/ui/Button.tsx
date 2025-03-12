import React from 'react';
/*
interface ButtonProps {
}*/

const Button = ({children} : any) => {
    return (
        <div className='button'>
            {children}
        </div>
    );
};

export default Button;
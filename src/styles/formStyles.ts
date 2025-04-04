export const formTextFieldStyles = {
    '& .MuiInputBase-root': {
        color: 'var(--text-color)',
        backgroundColor: 'var(--card-background)',
    },
    '& .MuiInputLabel-root': {
        color: 'var(--text-color)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--border-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--border-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--border-color)',
        },
    },
    '& .Mui-disabled': {
        color: 'var(--text-color) !important',
        WebkitTextFillColor: 'var(--text-color) !important',
        backgroundColor: 'var(--card-background) !important',
    },
    '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
        borderColor: 'var(--border-color) !important',
    },
};

export const formPaperStyles = {
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: 'none'
};

export const formButtonStyles = {
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'var(--hover-color)',
        transform: 'translateY(-2px)',
    },
    '&:active': {
        transform: 'translateY(0)',
    },
    '&.MuiButton-contained': {
        backgroundColor: 'var(--primary-color)',
        color: 'var(--text-color)',
        '&:hover': {
            backgroundColor: 'var(--primary-hover-color)',
        },
    },
    '&.MuiButton-outlined': {
        borderColor: 'var(--border-color)',
        color: 'var(--text-color)',
        '&:hover': {
            backgroundColor: 'var(--hover-color)',
            borderColor: 'var(--border-color)',
        },
    },
}; 
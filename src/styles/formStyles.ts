import { SxProps } from '@mui/system';

export const formTextFieldStyles: SxProps = {
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
            borderColor: 'var(--border-color-hover)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'var(--primary-color)',
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
    '& .MuiInputBase-input': {
        color: 'var(--text-color)',
    },
};

export const formPaperStyles: SxProps = {
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-color)',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: 'none'
};

export const formButtonStyles: SxProps = {
    backgroundColor: 'var(--card-background)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-color)',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
        borderColor: 'var(--border-color-hover)',
        backgroundColor: 'var(--button-hover-background)',
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

export const listItemStyles: SxProps = {
    '& .MuiListItemText-primary': {
        color: 'var(--text-color)',
    },
    '& .MuiListItemText-secondary': {
        color: 'var(--text-secondary-color)',
    },
}; 
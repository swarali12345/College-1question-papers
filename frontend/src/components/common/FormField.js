import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const FormField = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  autoFocus = false,
  icon: IconComponent,
  showPassword,
  onTogglePassword,
  sx,
}) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      id={name}
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      variant="outlined"
      sx={{
        ...sx,
        '& .MuiInputBase-root': {
          fontSize: { xs: '0.9rem', sm: '1rem' },
        },
        '& .MuiInputLabel-root': {
          fontSize: { xs: '0.9rem', sm: '1rem' },
        },
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'primary.main',
        },
      }}
      InputProps={{
        startAdornment: IconComponent && (
          <InputAdornment position="start">
            <IconComponent color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </InputAdornment>
        ),
        endAdornment: onTogglePassword && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onTogglePassword}
              edge="end"
              size="medium"
              color="primary"
            >
              {showPassword ? 
                <VisibilityOffIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> : 
                <VisibilityIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              }
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FormField; 
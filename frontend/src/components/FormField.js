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
      InputProps={{
        startAdornment: IconComponent && (
          <InputAdornment position="start">
            <IconComponent color="primary" />
          </InputAdornment>
        ),
        endAdornment: onTogglePassword && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onTogglePassword}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default FormField; 
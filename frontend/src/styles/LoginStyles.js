export const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.default',
  },
  appBar: {
    bgcolor: '#8B0000'
  },
  schoolIcon: {
    display: { xs: 'none', sm: 'flex' },
    mr: 1
  },
  toolbarTitle: {
    flexGrow: 1,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    bgcolor: '#8B0000',
    width: '200px',
    boxShadow: 3,
    zIndex: 1000,
  },
  mobileMenuButton: {
    py: 1.5
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    px: 4,
    py: 5,
  },
  loginIcon: {
    color: 'primary.main',
    fontSize: 40,
    mb: 1,
  },
  title: {
    mb: 3,
    fontWeight: 600,
  },
  errorMessage: {
    mb: 2,
    width: '100%',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    mt: 1,
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#8B0000',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8B0000',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#8B0000',
    },
  },
  submitButton: {
    mt: 3,
    mb: 2,
    py: 1.2,
  },
  registerBox: {
    mt: 2,
    display: 'flex',
    justifyContent: 'center',
  },
  registerButton: {
    p: 0,
    ml: 0.5,
    textTransform: 'none',
    fontWeight: 600,
  },
  iconColor: {
    color: '#8B0000'
  },
  secondaryText: {
    color: 'text.secondary',
  },
}; 
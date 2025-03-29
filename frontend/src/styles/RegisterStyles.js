export const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: '#f5f5f5'
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
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    py: 4,
  },
  paper: {
    p: { xs: 2, sm: 4 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 2,
    boxShadow: '0 3px 15px 2px rgba(139, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 20px 4px rgba(139, 0, 0, 0.15)',
    },
  },
  registerIcon: {
    color: '#8B0000',
    fontSize: 45,
    mb: 2,
    p: 1,
    borderRadius: '50%',
    backgroundColor: 'rgba(139, 0, 0, 0.1)',
  },
  title: {
    mb: 4,
    color: '#8B0000',
    fontWeight: 'bold',
    fontSize: { xs: '1.5rem', sm: '2rem' },
    textAlign: 'center',
  },
  errorMessage: {
    mb: 2,
    bgcolor: '#ffebee',
    p: 1.5,
    borderRadius: 1,
    width: '100%',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
  },
  form: {
    width: '100%',
    '& .MuiTextField-root': { mb: 2.5 },
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
    mt: 2,
    mb: 3,
    bgcolor: '#8B0000',
    '&:hover': {
      bgcolor: '#660000',
    },
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(139, 0, 0, 0.25)',
    transition: 'all 0.3s ease',
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  loginBox: {
    textAlign: 'center',
    p: 2,
    bgcolor: '#f8f8f8',
    borderRadius: 1,
    border: '1px solid #eee',
  },
  loginButton: {
    color: '#8B0000',
    fontWeight: 'bold',
    '&:hover': {
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  },
  iconColor: {
    color: '#8B0000'
  },
  secondaryText: {
    color: 'text.secondary'
  }
}; 
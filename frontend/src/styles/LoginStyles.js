export const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.default',
  },
  appBar: {
    bgcolor: 'primary.main'
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
    bgcolor: 'primary.main',
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
    py: { xs: 2, sm: 4 },
    px: { xs: 2, sm: 0 },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: { xs: 3, sm: 4 },
    borderTop: '4px solid',
    borderTopColor: 'primary.main',
    width: '100%',
    boxShadow: (theme) => `0 3px 15px 2px ${theme.palette.primary.main}1a`,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-5px)' },
      boxShadow: (theme) => `0 5px 20px 4px ${theme.palette.primary.main}26`,
    },
    borderRadius: 2,
    backgroundColor: 'background.paper',
  },
  loginIcon: {
    color: 'primary.main',
    fontSize: { xs: 40, sm: 45 },
    mb: { xs: 1, sm: 2 },
    p: 1,
    borderRadius: '50%',
    backgroundColor: (theme) => `${theme.palette.primary.main}1a`,
  },
  title: {
    mb: { xs: 2, sm: 4 },
    color: 'primary.main',
    fontWeight: 'bold',
    fontSize: { xs: '1.5rem', sm: '2rem' },
    textAlign: 'center',
    lineHeight: 1.2,
  },
  errorMessage: {
    mb: 2,
    width: '100%',
    textAlign: 'center',
    fontSize: { xs: '0.875rem', sm: '1rem' },
    bgcolor: '#ffebee',
    p: 1.5,
    borderRadius: 1,
    border: '1px solid #ffcdd2',
  },
  form: {
    width: '100%',
    mt: { xs: 1, sm: 2 },
    '& .MuiTextField-root': { mb: 2.5 },
  },
  textField: {
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
  },
  submitButton: {
    mt: 2,
    mb: 2,
    py: { xs: 1.2, sm: 1.5 },
    bgcolor: 'primary.main',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    fontSize: { xs: '0.9rem', sm: '1rem' },
    fontWeight: 'bold',
    boxShadow: (theme) => `0 2px 4px ${theme.palette.primary.main}40`,
    transition: 'all 0.3s ease',
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  registerBox: {
    textAlign: 'center',
    p: { xs: 1.5, sm: 2 },
    mt: { xs: 2, sm: 3 },
    bgcolor: '#f8f8f8',
    borderRadius: 1,
    border: '1px solid #eee',
  },
  registerButton: {
    p: 0,
    ml: 0.5,
    textTransform: 'none',
    fontWeight: 600,
    color: 'primary.main',
  },
  iconColor: {
    color: 'primary.main'
  },
  secondaryText: {
    color: 'text.secondary',
    fontSize: { xs: '0.875rem', sm: '1rem' },
  },
  divider: {
    my: { xs: 1.5, sm: 2 },
    width: '100%',
  },
}; 
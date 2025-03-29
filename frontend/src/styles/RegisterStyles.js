import backgroundImage from '../assets/newCroppedBg.jpg';

export const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
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
    py: { xs: 4, sm: 6 },
    px: { xs: 2, sm: 0 },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    p: { xs: 3, sm: 3.5 },
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      backgroundColor: 'primary.main',
    },
  },
  registerIcon: {
    color: 'primary.main',
    fontSize: { xs: 36, sm: 40 },
    mb: 1.5,
    p: 1,
    borderRadius: '50%',
    backgroundColor: (theme) => `${theme.palette.primary.main}1a`,
  },
  title: {
    mb: 2.5,
    color: 'primary.main',
    fontWeight: 'bold',
    fontSize: { xs: '1.4rem', sm: '1.6rem' },
    textAlign: 'center',
    lineHeight: 1.2,
  },
  errorMessage: {
    mb: 2,
    bgcolor: '#ffebee',
    p: 1.5,
    borderRadius: 1,
    width: '100%',
    textAlign: 'center',
    border: '1px solid #ffcdd2',
    fontSize: '0.875rem',
  },
  form: {
    width: '100%',
    '& .MuiTextField-root': { mb: 1.5 },
    mt: 1,
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
    mt: 1.5,
    mb: 2,
    bgcolor: 'primary.main',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    py: 1.25,
    fontSize: '0.95rem',
    fontWeight: 'bold',
    boxShadow: (theme) => `0 2px 8px ${theme.palette.primary.main}40`,
    transition: 'all 0.3s ease',
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  loginBox: {
    textAlign: 'center',
    p: 1.5,
    mt: 2,
    bgcolor: 'rgba(248, 248, 248, 0.8)',
    borderRadius: 1,
    border: '1px solid #eee',
  },
  loginButton: {
    color: 'primary.main',
    fontWeight: 'bold',
    p: 0,
    ml: 0.5,
    '&:hover': {
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  },
  iconColor: {
    color: 'primary.main'
  },
  secondaryText: {
    color: 'text.secondary',
    fontSize: '0.875rem',
  },
  divider: {
    my: 1.5,
    width: '100%',
  },
}; 
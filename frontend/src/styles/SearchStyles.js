import backgroundImage from '../assets/background.jpg';

const searchStyles = {
  root: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at center, rgba(183, 28, 28, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
      pointerEvents: 'none',
    },
  },
  paper: {
    padding: { xs: 3, md: 5 },
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '5px',
      width: '100%',
      backgroundColor: 'primary.main',
    },
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: 'primary.main',
    boxShadow: '0 8px 16px rgba(183, 28, 28, 0.4)',
    marginBottom: 3,
    border: '3px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 12px 20px rgba(183, 28, 28, 0.5)',
    },
  },
  title: {
    fontWeight: 700,
    color: 'primary.main',
    marginBottom: 1,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 4,
    textAlign: 'center',
    color: 'text.secondary',
  },
  formContainer: {
    width: '100%',
    marginBottom: 4,
  },
  formControl: {
    margin: '8px 0',
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: 'primary.light',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'primary.main',
    },
  },
  searchButton: {
    padding: '12px 30px',
    borderRadius: '50px', 
    fontWeight: 'bold',
    minWidth: '200px',
    boxShadow: '0 4px 20px rgba(183, 28, 28, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(183, 28, 28, 0.4)',
    },
  },
};

export default searchStyles; 
import backgroundImage from '../assets/newCroppedBg.jpg';

const subjectsStyles = {
  root: {
    minHeight: '100vh',
    width: '100%',
    padding: { xs: '24px 0 48px', md: '32px 0 64px' },
    position: 'relative',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    overflowY: 'auto',
  },
  breadcrumbs: {
    marginBottom: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '& .MuiBreadcrumbs-separator': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    '& a': {
      color: 'rgba(255, 255, 255, 0.9)',
      textDecoration: 'none',
      transition: 'color 0.2s',
      '&:hover': {
        color: 'white',
        textDecoration: 'underline',
      },
    },
  },
  header: {
    marginBottom: 5,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    color: 'white',
    '&:hover': {
      borderColor: 'white',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  title: {
    fontWeight: 700,
    color: 'white',
    textAlign: 'center',
    marginBottom: 1,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '700px',
    marginBottom: 2,
  },
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    color: 'white',
  },
  subjectCard: {
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.25)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
    height: '100%',
  },
  subjectIcon: {
    backgroundColor: 'rgba(183, 28, 28, 0.1)',
    borderRadius: '50%',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  subjectName: {
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: 1,
    color: 'text.primary',
  },
  subjectCode: {
    textAlign: 'center',
    marginBottom: 2,
  },
  paperCount: {
    backgroundColor: 'primary.main',
    color: 'white',
    fontWeight: 'bold',
  },
  noSubjects: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    width: '100%',
    color: 'white',
    margin: '0 auto',
    padding: '24px',
    textAlign: 'center',
  },
};

export default subjectsStyles; 
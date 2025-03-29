const profileStyles = {
  profileContainer: {
    py: 4,
  },
  paper: {
    p: 4,
    borderTop: '4px solid #b71c1c'
  },
  avatarContainer: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    mb: 3
  },
  avatar: {
    width: 100, 
    height: 100, 
    mb: 2, 
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  userEmail: {
    display: 'flex', 
    alignItems: 'center', 
    mt: 0.5
  },
  emailIcon: {
    mr: 0.5
  },
  buttonContainer: {
    display: 'flex', 
    justifyContent: 'space-between'
  },
  editButtonContainer: {
    mt: 3, 
    display: 'flex', 
    justifyContent: 'space-between'
  }
};

export default profileStyles; 
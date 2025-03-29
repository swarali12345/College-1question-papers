import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardActionArea,
  Typography,
  Avatar,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import { 
  Computer as ComputerIcon,
  Science as ScienceIcon,
  Calculate as CalculateIcon,
  Psychology as PsychologyIcon,
  Architecture as ArchitectureIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  MoreVert as MoreVertIcon,
  Assignment as AssignmentIcon,
  Folder as FolderIcon
} from '@mui/icons-material';

// Card background patterns
const cardBackgrounds = [
  {
    color: '#1a73e8', // Blue
    pattern: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414l5.586-5.586zm16.706 0L89 80.414 94.586 86H83.414l5.586-5.586zm16.707 0L105 80.414 110.586 86H99.414l5.586-5.586z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
  },
  {
    color: '#e8710a', // Orange
    pattern: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
  },
  {
    color: '#0f9d58', // Green
    pattern: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
  },
  {
    color: '#db4437', // Red
    pattern: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  },
  {
    color: '#673ab7', // Purple
    pattern: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M13 0v8H8l5-8zm8 16v8h-5l5-8zM39 0v8h-5l5-8zm8 16v8h-5l5-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  },
  {
    color: '#795548', // Brown
    pattern: `url("data:image/svg+xml,%3Csvg width='84' height='48' viewBox='0 0 84 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h12v6H0V0zm28 8h12v6H28V8zm14-8h12v6H42V0zm14 0h12v6H56V0zm0 8h12v6H56V8zM42 8h12v6H42V8zm0 16h12v6H42v-6zm14-8h12v6H56v-6zm14 0h12v6H70v-6zm0-16h12v6H70V0zM28 32h12v6H28v-6zM14 16h12v6H14v-6zM0 24h12v6H0v-6zm0 8h12v6H0v-6zm14 0h12v6H14v-6zm14 8h12v6H28v-6zm-14 0h12v6H14v-6zm28 0h12v6H42v-6zm14-8h12v6H56v-6zm0-8h12v6H56v-6zm14 8h12v6H70v-6zm0 8h12v6H70v-6zM14 24h12v6H14v-6zm14-8h12v6H28v-6zM14 8h12v6H14V8zM0 8h12v6H0V8z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`
  }
];

// Function to get a random background
const getRandomBackground = (id) => {
  const index = id % cardBackgrounds.length;
  return cardBackgrounds[index];
};

// Function to get an icon based on subject name or code
const getSubjectIcon = (subject) => {
  const name = subject.name.toLowerCase();
  const code = subject.code.toLowerCase();
  
  if (name.includes('computer') || code.includes('cs') || name.includes('computing')) {
    return <ComputerIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('data') || name.includes('database') || code.includes('db')) {
    return <StorageIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('math') || code.includes('math')) {
    return <CalculateIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('phys') || name.includes('chem') || name.includes('science')) {
    return <ScienceIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('artificial') || name.includes('intelligence') || name.includes('ai')) {
    return <PsychologyIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('architect') || name.includes('design')) {
    return <ArchitectureIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('programming') || name.includes('code') || name.includes('software')) {
    return <CodeIcon sx={{ fontSize: 40 }} />;
  } else if (name.includes('english') || name.includes('language') || name.includes('communication')) {
    return <LanguageIcon sx={{ fontSize: 40 }} />;
  } else {
    return <ComputerIcon sx={{ fontSize: 40 }} />;
  }
};

const SubjectCard = ({ subject, year, semester }) => {
  const navigate = useNavigate();
  const background = getRandomBackground(subject.id);
  
  // Generate sections/batches based on subject code
  const section = subject.code.includes('1') ? 'A' : subject.code.includes('2') ? 'B' : 'A_B_C';
  
  // Get a teacher name based on subject id
  const teachers = [
    'Dr. Sarah Williams',
    'Prof. John Smith',
    'Dr. Emily Chen',
    'Prof. Michael Johnson',
    'Dr. Raj Patel',
    'Prof. Sophia Rodriguez',
    'Dr. James Wilson',
    'Prof. Nisha Sharma',
    'Dr. Robert Miller'
  ];
  const teacherName = teachers[subject.id % teachers.length];

  const handleCardClick = () => {
    navigate(`/papers/${subject.id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent card navigation when clicking on menu
    // In a real app, you would open a menu here
  };

  return (
    <Card 
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        minHeight: '170px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        sx={{ height: '100%' }}
      >
        {/* Card Header with Background */}
        <CardMedia
          sx={{
            height: '96px',
            backgroundColor: background.color,
            backgroundImage: background.pattern,
            position: 'relative',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Options Menu */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton 
              size="small" 
              sx={{ color: 'white' }}
              onClick={handleMenuClick}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Subject Title */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: 'white',
              fontWeight: 500,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              pr: 4, // Make room for the menu button
            }}
          >
            {subject.code} ({subject.name})
          </Typography>
          
          {/* Section/Division info */}
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              opacity: 0.9,
              fontWeight: 400,
            }}
          >
            {section}
          </Typography>
        </CardMedia>
        
        {/* Card Content */}
        <CardContent 
          sx={{
            p: 2,
            pt: 1.5
          }}
        >
          {/* Teacher Name */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2
            }}
          >
            {teacherName}
          </Typography>
          
          {/* Paper Count displayed as a folder or book icon */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 1
          }}>
            <FolderIcon 
              sx={{ 
                color: 'text.secondary',
                fontSize: 16,
                mr: 1,
                opacity: 0.7
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {subject.papers} papers
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Accent icon - displays in bottom left corner like Google Classroom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 2,
          opacity: 0.9,
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${background.color}22`, // Semi-transparent version of card color
            width: 40,
            height: 40,
          }}
        >
          <AssignmentIcon sx={{ color: background.color }} />
        </Avatar>
      </Box>
    </Card>
  );
};

export default SubjectCard; 
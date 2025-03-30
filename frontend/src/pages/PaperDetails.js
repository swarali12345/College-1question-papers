import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Chip, 
  Button, 
  CircularProgress, 
  Alert,
  Divider,
  Stack,
  Link
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CloudDownload as CloudDownloadIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon,
  School as SchoolIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import axios from '../utils/axios';
import { ROUTES } from '../constants';
import { format } from 'date-fns';

const PaperDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [viewerType, setViewerType] = useState('native'); // 'native' or 'external'

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await axios.get(`/api/papers/${id}`);
        setPaper(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching paper details:', err);
        setError('Failed to load paper details. Please try again.');
        setLoading(false);
      }
    };

    if (id) {
      fetchPaperDetails();
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      // Increment download count
      await axios.put(`/api/papers/${id}/download`);
      
      // Trigger download
      window.open(paper.fileUrl, '_blank');
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const togglePdfViewer = () => {
    setShowPdfViewer(!showPdfViewer);
  };

  const toggleViewerType = () => {
    setViewerType(viewerType === 'native' ? 'external' : 'native');
  };

  const getGoogleViewerUrl = (pdfUrl) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return 'Date not available';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!paper) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Paper not found or you don't have permission to view it.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <DescriptionIcon color="primary" />
              <Typography variant="h5" component="h1" fontWeight="bold">
                {paper.title}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Subject</Typography>
                <Typography variant="body1">{paper.subject}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Year & Semester</Typography>
                <Typography variant="body1">{paper.year}, {paper.semester}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Batch</Typography>
                <Typography variant="body1">{paper.batch}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Exam Type</Typography>
                <Typography variant="body1">{paper.examType}</Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Uploaded On</Typography>
                <Typography variant="body1">{formatDate(paper.createdAt)}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Views</Typography>
                <Typography variant="body1">{paper.views}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">Downloads</Typography>
                <Typography variant="body1">{paper.downloads}</Typography>
              </Box>

              {paper.comment && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Comments</Typography>
                  <Typography variant="body1">{paper.comment}</Typography>
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  File: {paper.fileUrl?.split('/').pop() || 'File not available'}
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleDownload}
                  sx={{ mr: 2 }}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={togglePdfViewer}
                  sx={{ mr: 2 }}
                >
                  {showPdfViewer ? 'Hide PDF' : 'View PDF'}
                </Button>
                {showPdfViewer && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={toggleViewerType}
                    startIcon={<PdfIcon />}
                  >
                    {viewerType === 'native' ? 'Try External Viewer' : 'Try Native Viewer'}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {showPdfViewer && paper.fileUrl && (
            <Grid item xs={12} sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>PDF Preview</Typography>
              
              {viewerType === 'native' ? (
                <Box sx={{ width: '100%', height: '80vh', border: '1px solid #ddd', bgcolor: '#f5f5f5', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <object
                    data={paper.fileUrl}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  >
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" gutterBottom>
                        Your browser cannot display the PDF directly.
                      </Typography>
                      <Button 
                        variant="contained"
                        color="primary"
                        onClick={toggleViewerType}
                        sx={{ mt: 2 }}
                      >
                        Try External Viewer
                      </Button>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        If the PDF doesn't load, try using the external viewer or download it instead.
                      </Typography>
                    </Box>
                  </object>
                </Box>
              ) : (
                <Box sx={{ width: '100%', height: '80vh', border: '1px solid #ddd' }}>
                  <iframe
                    src={getGoogleViewerUrl(paper.fileUrl)}
                    title={paper.title}
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                  />
                </Box>
              )}
              
              <Box mt={2} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  If the viewers above don't work, you can {' '}
                  <Link href={paper.fileUrl} target="_blank" rel="noopener noreferrer">
                    open the PDF directly
                  </Link>
                  {' '} in a new tab or download it.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default PaperDetails; 
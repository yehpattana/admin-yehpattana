import React, { useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton, Modal, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const SizeChartModal = ({ url, masterCode }: { url: string; masterCode: string }) => {
  const [open, setOpen] = useState(false);
  const [sizeChart, setSizeChart] = useState<any>([]);
  const [coverImageURL, setcoverImageURL] = useState<string>();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setcoverImageURL('');
  };
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setcoverImageURL('');
    } else if (event.target.files[0]) {
      const URLimage = URL.createObjectURL(event.target.files[0]);
      if (URLimage) {
        setSizeChart(event.target.files[0]);
        setcoverImageURL(URLimage);
        // setUpdateProduct({ ...updateProduct, cover_image: event.target.files[0] });
      }
    }
  };
  const handleSubmitUpdateSizeChart = async () => {
    const formData = new FormData();
    //   formData.append('master_code', master_codel);
    console.log('sizeChart', sizeChart);
    formData.append('master_code', masterCode);
    formData.append('size_chart', sizeChart);

    await apiService
      .patch(`products/admin/update-size-chart`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        handleClose()
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleRemoveSizeChart = async () => {
    const formData = new FormData();
    //   formData.append('master_code', master_codel);
    console.log('sizeChart', sizeChart);
    formData.append('master_code', masterCode);
    formData.append('size_chart', '');

    await apiService
      .patch(`products/admin/update-size-chart`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        handleClose()
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <Button onClick={handleOpen} className="text-blue-500 underline">
        Sizechart
      </Button>
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>{' '}
          {coverImageURL || url ? (
            <img
              src={coverImageURL || url}
              alt="Size Chart"
              className="w-1/5 object-cover mx-auto max-h-28"
              style={{ width: '100%', objectFit: 'cover', marginRight: 'auto', marginLeft: 'auto' }}
            />
          ) : null} 
          <Box sx={{ width: '90%', display: 'flex', justifyContent: 'space-evenly' }}>
            <TextField
              type="file"
              inputProps={{ accept: 'image/png, image/jpeg' }}
              onChange={handleCoverImageChange}
            />{' '}
            <Button onClick={handleSubmitUpdateSizeChart} variant="outlined" sx={{ padding: '5px 5px' }}>
              save
            </Button>
            <Button onClick={handleRemoveSizeChart} variant="outlined" color='error' sx={{ padding: '5px 5px' }}>
              Remove
            </Button>
          </Box>
        </Box>
      </Modal> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '70%', sm: '75%', md: '40%' }, // Responsive width
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: { xs: 2, md: 4 }, // Responsive padding
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'gray' }}
          >
            <CloseIcon />
          </IconButton>
            <img
              src={coverImageURL || url}
              alt="Size Chart"
              className="w-full object-cover mx-auto"
              style={{
                maxHeight: '300px', // Limit the image height for responsiveness
                objectFit: 'cover',
                marginRight: 'auto',
                marginLeft: 'auto',
              }}
            />
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              mt: 2,
            }}
          >
            <TextField
              type="file"
              inputProps={{ accept: 'image/png, image/jpeg' }}
              onChange={handleCoverImageChange}
              sx={{ flexGrow: 1, mb: { xs: 2, sm: 0 }, mr: { sm: 2 }, width: '50px' }} // Responsive margin
            />
            <Button
              onClick={handleSubmitUpdateSizeChart}
              variant="outlined"
              sx={{ padding: '5px 5px', mb: { xs: 2, sm: 0 }, mr: 2 }}
            >
              Save
            </Button>
            <Button onClick={handleRemoveSizeChart} variant="outlined" color="error" sx={{ padding: '5px 5px' }}>
              Remove
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default SizeChartModal;

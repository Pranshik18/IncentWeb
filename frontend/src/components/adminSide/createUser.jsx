import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function CreateUser() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [emp_Stat, setEmpStat] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCheckedItems([...checkedItems, value]);
    } else {
      setCheckedItems(checkedItems.filter((item) => item !== value));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:3012/employee', {
        emp_name: name,
        emp_email: email,
        emp_pass: pass,
        emp_Stats: emp_Stat,
        emp_role: role,
        permissions: checkedItems,
      })
      .then(() => {
        setOpen(true);
        navigate(-1);
      });
  };
  console.log(checkedItems);
  return (
    <ThemeProvider theme={defaultTheme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          color="inherit"
          onClick={handleOpenModal}
          sx={{ position: 'absolute', top: 0, right: 0 }}
        >
          <SettingsIcon />
        </IconButton>
        <Typography component="h1" variant="h5">
          Add User
        </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={(e)=> setRole(e.target.value)}
        >
          <MenuItem value={"Team Lead"}>Team Lead</MenuItem>
          <MenuItem value={"Associate Software Developer"}>Associate Software Developer</MenuItem>
          <MenuItem value={"Software Trainee"}>Software Trainee</MenuItem>
        </Select>
      </FormControl>
      <Stack spacing={2} sx={{ width: '100%' }}>
              {checkedItems.length === 0 && (
                <Alert severity="info">Please click on settings to add permissions</Alert>
              )}
              </Stack>
    </Box>
            
            {error ? (
              <Alert severity="error">
                Wrong Credentials Please Try Again!
              </Alert>
            ) : (
              ""
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add
            </Button>
          </Box>
          <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
                    <FormControl fullWidth>
            <InputLabel id="crud-checkbox-label">Permissions</InputLabel>
            <Select
              labelId="crud-checkbox-label"
              id="crud-checkbox"
              multiple
              value={checkedItems}
              onChange={handleCheckboxChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {/* ... */}
            </Select>
          </FormControl>
          {/* Add checkboxes for each CRUD operation */}
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.includes('create')}
                onChange={handleCheckboxChange}
                value="create"
              />
            }
            label="Create"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.includes('read')}
                onChange={handleCheckboxChange}
                value="read"
              />
            }
            label="Read"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.includes('update')}
                onChange={handleCheckboxChange}
                value="update"
              />
            }
            label="Update"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedItems.includes('delete')}
                onChange={handleCheckboxChange}
                value="delete"
              />
            }
            label="Delete"
          />
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2, mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
      <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          User Added Successfully! Please Go back
        </Alert>
      </Snackbar>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

    </ThemeProvider>
  );
}

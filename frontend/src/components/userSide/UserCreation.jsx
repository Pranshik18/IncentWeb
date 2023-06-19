import React, { useEffect, useState } from 'react';
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
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserSideCreateUser() {
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
  const [cardPermissions, setCardPermissions] = useState([]);
  const [createdBy, setCreatedBy] = useState("Admin");
  const [modifiedBy, setModifiedBy] = useState("Admin");
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
    const { name, value, checked } = event.target;
    if (name === 'permissions') {
      if (checked) {
        setCheckedItems([...checkedItems, value]);
      } else {
        setCheckedItems(checkedItems.filter((item) => item !== value));
      }
    } else if (name === 'cardPermissions') {
      if (checked) {
        setCardPermissions([...cardPermissions, value]);
      } else {
        setCardPermissions(cardPermissions.filter((item) => item !== value));
      }
    }
  };
    
    useEffect(() => {
       const id = localStorage.getItem("ID")
        axios.get(`http://localhost:3012/employee/${id}`).then((res) => {
            setCreatedBy(res.data.emp_name)
            setModifiedBy(res.data.emp_name)
        console.log(res.data);
    })
},[])

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
        card_permissions: cardPermissions,
        createdBy: createdBy,
        modifiedBy : modifiedBy
      })
      .then(() => {
        setOpen(true);
        navigate(-1);
      });
  };

  return (
    <ThemeProvider theme={createTheme()}>
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pass"
              label="Password"
              type="password"
              id="pass"
              autoComplete="new-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="Team Lead">Team Lead</MenuItem>
                <MenuItem value="Associate Software Developer">Associate Software Developer</MenuItem>
                <MenuItem value="Software Trainee">Software Trainee</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Permissions:</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems.includes('create')}
                    onChange={handleCheckboxChange}
                    name="permissions"
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
                    name="permissions"
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
                    name="permissions"
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
                    name="permissions"
                    value="delete"
                  />
                }
                label="Delete"
              />
            </FormControl>
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Card Permissions:</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cardPermissions.includes('view')}
                    onChange={handleCheckboxChange}
                    name="cardPermissions"
                    value="view"
                  />
                }
                label="View"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cardPermissions.includes('create')}
                    onChange={handleCheckboxChange}
                    name="cardPermissions"
                    value="create"
                  />
                }
                label="Create"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cardPermissions.includes('edit')}
                    onChange={handleCheckboxChange}
                    name="cardPermissions"
                    value="edit"
                  />
                }
                label="Edit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={cardPermissions.includes('delete')}
                    onChange={handleCheckboxChange}
                    name="cardPermissions"
                    value="delete"
                  />
                }
                label="Delete"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Create User
            </Button>
          </Box>
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            User created successfully!
          </Alert>
        </Snackbar>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
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
            <Typography variant="h6" id="modal-title" component="h2">
              User Permissions
            </Typography>
            <Typography variant="body2" id="modal-description" sx={{ mt: 2 }}>
              Configure user permissions here.
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Permissions:</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems.includes('create')}
                    onChange={handleCheckboxChange}
                    name="permissions"
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
                    name="permissions"
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
                    name="permissions"
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
                    name="permissions"
                    value="delete"
                  />
                }
                label="Delete"
              />
            </FormControl>
          </Box>
        </Modal>
      </Container>
    </ThemeProvider>
  );
}

export default UserSideCreateUser;
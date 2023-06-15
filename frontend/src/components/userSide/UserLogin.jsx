import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LogIn() {
  const [email, setEmail] = useState();
    const [pass, setPass] = useState();
    const [error, setError] = useState();
    const [Data, setData] = useState([]);
    const navigate = useNavigate();
    

    useEffect(() => {
        axios.get('http://localhost:3012/employee')
          .then((res) => {
          setData(res.data)
          })
    }, [])
    
    console.log(Data);

  const handleSubmit = (event) => {
    event.preventDefault();
      if (Data.some(employee => employee.emp_email === email)) {
        if (Data.some(employee => employee.emp_pass === pass)) {
          const id = Data.find(employee => employee.emp_email=== email)
          localStorage.setItem("ID" , id._id)
              navigate('/user/userPerformance')
          }
          else {
              setError(true)
          }
      }
      else {
          setError(true)
      }
  };
    
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            User LogIn
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
                      {error ? <Alert severity="error">Wrong Credentials Please Try Again!</Alert>:''}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

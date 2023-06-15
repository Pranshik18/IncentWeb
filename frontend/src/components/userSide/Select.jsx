import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  LinearProgress,
  Paper,
  Alert,
  Button,
  Grid,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import ReactSpeedometer from "react-d3-speedometer";
import { Stack } from "@mui/system";

export default function SelectAutoWidth() {
  const [month, setMonth] = useState("");
  const [allUserData, setAllUserData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [performance, setPerformance] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [maxValues, setMaxValues] = useState({});
  const [incentive, setIncentive] = useState(1000);
  const [yourScore, setYourScore] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [particularData, setparticularData] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3012/employee").then((res) => {
      setAllUserData(res.data);
      
    });
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("ID");
    const newData = allUserData.filter((item) => {
      return item._id !== data;
    });
    console.log(newData);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("ID");
    axios.get(`http://localhost:3012/employee/${data}`).then((res) => {
      console.log(res.data);
      setRole(res.data.emp_role);
      setUserPermissions(res.data.permissions)
      setName(res.data.emp_name);
      setPerformance(res.data.emp_Stats);
      setUserData(res.data);
    });
  }, []);

  useEffect(() => {  
    const selectedMonth = performance.find(
      (monthly) => monthly.month === month
    );
    if (selectedMonth) {
      setMonthlyData(selectedMonth.ValueArray);
    } else {
      setMonthlyData([]);
    }
  }, [month, performance]);

  useEffect(() => {
    const statData = JSON.parse(localStorage.getItem("statData"));
    if (statData) {
      const maxValuesObj = {};
      statData.forEach((item) => {
        maxValuesObj[item.statValue] = Number(item.statRange);
      });
      setMaxValues(maxValuesObj);
    }
  }, []);

  useEffect(() => {
    if (yourScore > 300) {
      setIncentive(incentive * 2);
    }
    if (yourScore > 600) {
      setIncentive(incentive * 3);
    }
    if (yourScore > 900) {
      setIncentive(incentive * 4);
    }
    if (yourScore > 1000) {
      setIncentive(incentive * 5);
    }
    if (yourScore > 1200) {
      setIncentive(incentive * 6);
    }
  }, [yourScore]);

  useEffect(() => {
    if (monthlyData.length > 0) {
      const totalScore = monthlyData.reduce((acc, item) => {
        const userScore =
          (item.UserValue / (maxValues[item.StatType] || 100)) * 100;
        return acc + userScore;
      }, 0);
      setYourScore(totalScore);
    } else {
      setYourScore(0);
    }
  }, [monthlyData, maxValues]);

  useEffect(() => {
    if (performance.length > 0) {
      const lastMonth = performance[performance.length - 1].month;
      setMonth(lastMonth);
    }
  }, [performance]);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  useEffect(() => {
    if (performance.length > 0) {
      const lastMonth = performance[performance.length - 1].month;
      setMonth(lastMonth);
    }
  }, [performance]);

  const handleClick = () => {
    if (userPermissions.includes("update")) {
      setDialog(true);
      setError(false);
      setOpenModal(true);
      const data = localStorage.getItem("ID");
      const newData = allUserData.filter((item) => item._id !== data);
      setparticularData(newData);
    } else {
      setError(true);
      setDialog(false);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleStat = (index, i) => {
    localStorage.setItem("index", index);
    navigate("/user/userStats");
  };

  const handleDelete = (index) => {
    const deletedUserId = particularData[index]._id;
    axios
      .delete(`http://localhost:3012/employee/${deletedUserId}`)
      .then((res) => {
        const updatedData = particularData.filter(
          (item) => item._id !== deletedUserId
        );
        setparticularData(updatedData);
      });
  };

  const getUser = () => {
    axios.get("http://localhost:3012/employee").then((res) => {
      console.log(res.data);
    });
  };

  console.log(allUserData);
  return (
    <div>
      <Typography variant="h3" style={{ margin: "15px", flexWrap: "wrap" }}>
        Greetings {name}!
      </Typography>
      <FormControl sx={{ m: 1, minWidth: "100%" }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          Monthly Performance
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={month}
          onChange={handleChange}
          autoWidth
          label="Monthly Performance"
        >
          {performance.map((item) => {
            return (
              <MenuItem key={item.month} value={item.month}>
                {item.month}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Alert severity="info" sx={{ width: "90%", margin: "0 auto" }}>
        Update Other's Data?
        <Button onClick={handleClick}>Click Here</Button>
        {error ? (
          <Alert severity="warning">
            Permission is not allowed to change other's data
          </Alert>
        ) : (
          ""
        )}
      </Alert>
      <Container>
        <Grid item xs={12} md={4} lg={3}>
          <h2>Score</h2>
          <Paper>
            <Stack spacing={2}>
              <Alert severity="info">
                Total Calculated Incentive Rs: {incentive}
              </Alert>
            </Stack>
          </Paper>
        </Grid>
        {monthlyData.length > 0 ? (
          <div style={{ display: "flex", margin: "10px", flexWrap: "wrap" }}>
            {monthlyData.map((item) => {
              return (
                <ReactSpeedometer
                  key={item.StatType}
                  value={item.UserValue}
                  currentValueText={`${item.StatType}: ${(
                    (item.UserValue / maxValues[item.StatType]) *
                    100
                  ).toFixed(0)}%`}
                  minValue={0}
                  maxValue={maxValues[item.StatType] || 100}
                  ringWidth={40}
                  needleTransitionDuration={3333}
                  needleTransition="easeElastic"
                  customSegmentLabels={[
                    { text: "Very Bad", position: "INSIDE", color: "#000000" },
                    { text: "Bad", position: "INSIDE", color: "#000000" },
                    { text: "Good", position: "INSIDE", color: "#000000" },
                    { text: "Great!", position: "INSIDE", color: "#000000" },
                    { text: "Awesome!", position: "INSIDE", color: "#000000" },
                  ]}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}
        {monthlyData.length > 0 && (
          <div style={{ margin: "10px" }}>
            <Typography variant="h6">Overall Score</Typography>
            <LinearProgress
              variant="determinate"
              value={(yourScore / 1200) * 100}
            />
            <Typography variant="body2">
              Your Score: {yourScore.toFixed(2)} / Max Score: {1200}
            </Typography>
          </div>
        )}
      </Container>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Container
          maxWidth="md"
          sx={{
            marginTop: "10%",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: "#000",
              marginTop: "10%",
              backgroundColor: "white",
              padding: "20px",
            }}
          >
            Select Other Employees Data
          </Typography>
          <Typography variant="h6" style={{ backgroundColor: "white" }}>
            Total users: {particularData.length}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Stats</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {particularData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.emp_role}</TableCell>
                    <TableCell>{entry.emp_name}</TableCell>
                    <TableCell>{entry.emp_email}</TableCell>
                    <TableCell>
                      {userPermissions.includes("update") && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleStat(entry._id)}
                        >
                          Stats 
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {userPermissions.includes("delete") && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Modal>
    </div>
  );
}

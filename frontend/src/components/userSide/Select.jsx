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
  TextField,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import ReactSpeedometer from "react-d3-speedometer";
import { Stack } from "@mui/system";
import Box from "@mui/material/Box";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SelectAutoWidth() {
  const [month, setMonth] = useState("");
  const [allUserData, setAllUserData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [localStorageData, setLocalStorageData] = useState(
    JSON.parse(localStorage.getItem("statData") || [])
  );
  const [particularUserData, setParticularUserData] = useState([]);
  const [role, setRole] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [performance, setPerformance] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [maxValues, setMaxValues] = useState({});
  const [incentive, setIncentive] = useState(1000);
  const [yourScore, setYourScore] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState(false);
  const [statValue, setStatValue] = useState("");
  const [statRange, setStatRange] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [particularData, setparticularData] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [cardPermissions, setCardPermissions] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [modifiedBy, setModifiedBy] = useState("");
  const [statsData, setStatsData] = React.useState(JSON.parse(localStorage.getItem("statData") || "[]"));
  const navigate = useNavigate();
  const [editModal , setEditModal] = useState(false)
  const handlemodalOpen = () => setOpen(true);
  const handlemodalClose = () => setOpen(false);
  const handleEditModalOpen = () => setEditModal(true);
  const handleEditModalClose = () => setEditModal(false);

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
      setParticularUserData(res.data)
      setRole(res.data.emp_role);
      setCreatedBy(res.data.emp_name);
      setModifiedBy(res.data.emp_name);
      setUserPermissions(res.data.permissions);
      setCardPermissions(res.data.card_permissions);
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
    if (
      userPermissions.includes("update") ||
      userPermissions.includes("delete") ||
      userPermissions.includes("create") ||
      userPermissions.includes("read")
    ) {
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

  const editStat = (i) => {
    handleEditModalOpen()
    localStorage.setItem("ParticularDataIndex" , i)
    setStatValue(localStorageData[i].statValue)
    setStatRange(localStorageData[i].statRange)
  }

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

  const handleCreate = () => {
    navigate("/user/createUser");
  };

  const getUser = () => {
    axios.get("http://localhost:3012/employee").then((res) => {
      console.log(res.data);
    });
  };

  const handleStatDelete = (index) => {
    const updatedData = [...localStorageData];
    console.log(localStorageData.splice(index , 1));
    updatedData.splice(index, 1);
    setLocalStorageData(updatedData);
    localStorage.setItem('statData', JSON.stringify(updatedData));
  }
  const handleSaveStat = () => {
    const newStat = {
      statValue,
      statRange,
      createdBy,
      modifiedBy
    };

    const updatedStatData = [...statsData, newStat];
    setStatsData(updatedStatData);
    localStorage.setItem('statData', JSON.stringify(updatedStatData));

    setStatRange("");
    setStatValue("");
    handlemodalClose();
  };

  console.log(monthlyData , maxValues);

  const handleSaveEditStat = () => {
    const index = localStorage.getItem("ParticularDataIndex");
    const updated = {
      ...localStorageData[index],
      statValue: statValue,
      statRange: statRange,
      modifiedBy: modifiedBy
    };

    setStatsData([updated]); // Update statsData as an array

    localStorage.setItem("statData", JSON.stringify(updated));
    handleEditModalClose();

    // Updating API
    const id = localStorage.getItem("ID");
    const updatedPerformance = performance.map((performanceItem) => {
      if (performanceItem.month === month) {
        const newValueArray = performanceItem.ValueArray || [];
        newValueArray.push({
          StatType: statValue,
          UserValue: 0,
          UserMaxValue: Number(statRange),
        });
        return {
          ...performanceItem,
          ValueArray: newValueArray,
        }
      }
      return performanceItem;
    });

    axios.put(`http://localhost:3012/employee/${id}`, {
      emp_Stats: updatedPerformance
    })
      .then((res) => {
        console.log("API Updated", res.data);
      })
      .catch((error) => {
        console.log("Error Updating API", error.message);
      });
  };
  useEffect(() => {
    localStorage.setItem("statData", JSON.stringify(statsData));
  }, [statsData]);

  console.log(localStorageData);
  console.log(performance);

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
      {
        userPermissions.includes("create") ?
          <Alert severity="success">Create User by clicking
            <Button onClick={()=>handleCreate()}>Create User</Button>
          </Alert> :
          <Alert severity="warning">You dont have permission to Create New User</Alert>
      }
      <Alert severity="info" sx={{ width: "90%", margin: "0 auto" }}>
        Read Other Users Data?
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
                  currentValueText={`${item.StatType} : ${item.UserValue}%`}
                  minValue={0}
                  maxValue={maxValues[item.UserMaxValue] || 100}
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
        <Typography variant="h4">Parameters</Typography>
        {cardPermissions.includes("create") ? (
          <Button variant="contained" onClick={handlemodalOpen}>
            Create Param
          </Button>
        ) : (
          <Button variant="contained" disabled>
            Create Param
          </Button>
        )}
        {cardPermissions.includes("read") || cardPermissions.includes("create") ? <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Max Value</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Last Modified By</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localStorageData.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.statValue}</TableCell>
                  <TableCell>{entry.statRange}</TableCell>
                  <TableCell>{entry.createdBy}</TableCell>
                  <TableCell>{entry.modifiedBy}</TableCell>
                  <TableCell>
                    {cardPermissions.includes("edit") ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => editStat(index)}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button variant="contained" color="primary" disabled>
                        Stats
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {cardPermissions.includes("delete") ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleStatDelete(index)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button variant="contained" color="secondary" disabled>
                        {" "}
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>: ''}
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
            padding: "15px",
            overflow: "auto",
            height: "500px",
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: "#000",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            Select Other Employees Data
          </Typography>
          <Typography
            variant="h6"
            style={{ backgroundColor: "white", paddingLeft: "10px" }}
          >
            Total users: {particularData.length}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>CreatedBy</TableCell>
                  <TableCell>ModifiedBy</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {particularData.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.emp_role}</TableCell>
                    <TableCell>{entry.emp_name}</TableCell>
                    <TableCell>{entry.emp_email}</TableCell>
                    <TableCell>{entry.createdBy}</TableCell>
                    <TableCell>{entry.modifiedBy}</TableCell>
                    <TableCell>
                      {userPermissions.includes("update") ? (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleStat(entry._id)}
                        >
                          Stats
                        </Button>
                      ) : (
                        <Button variant="contained" color="primary" disabled>
                          Stats
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      {userPermissions.includes("delete") ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button variant="contained" color="secondary" disabled>
                          {" "}
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
      <Modal
        open={open}
        onClose={handlemodalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4">Add Stats</Typography>
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            label="type of Stat"
            value={statValue}
            variant="outlined"
            onChange={(e) => setStatValue(e.target.value)}
          />
          <br />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="number"
            label="Max range of Stat"
            value={statRange}
            variant="outlined"
            onChange={(e) => setStatRange(e.target.value)}
          />
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={handleSaveStat}>
            Save stat
          </Button>
        </Box>
      </Modal>
      <Modal
        open={editModal}
        onClose={handleEditModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4">Edit Stats</Typography>
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="text"
            label="type of Stat"
            value={statValue}
            variant="outlined"
            onChange={(e) => setStatValue(e.target.value)}
          />
          <br />
          <TextField
            style={{ width: "300px", margin: "5px" }}
            type="number"
            label="Max range of Stat"
            value={statRange}
            variant="outlined"
            onChange={(e) => setStatRange(e.target.value)}
          />
          <br />
          <br />
          <Button variant="contained" color="primary" onClick={handleSaveEditStat}>
            Save stat
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Box, Container } from "@mui/system";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Slider from "@mui/material/Slider";
import MenuItem from "@mui/material/MenuItem";
import { Button, CardMedia, Grid } from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles((theme) => ({
  card: {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: 8,
    padding: theme.spacing(2),
    backgroundColor: "#ffffff",
  },
  title: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  mainCont: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    textAlign: "center",
  },
  btn: {
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
}));

const UserSideStats = () => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const ind = localStorage.getItem("index");
  const [sliderValue, setSliderValue] = useState({});
  const [performance, setPerformance] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updatedValue, setUpdatedValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [statsData, setStatsData] = React.useState(
    JSON.parse(localStorage.getItem("statData") || "[]")
  );
  const [empId, setEmpId] = useState(ind)

  useEffect(() => {
    axios.get(`http://localhost:3012/employee/${ind}`).then((res) => {
      setPerformance(res.data.emp_Stats);
      setName(res.data.emp_name);
    });
    setData(JSON.parse(localStorage.getItem("statData")));
  }, []);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  useEffect(() => {
    if (performance.length > 0) {
      const lastMonth = performance[performance.length - 1].month;
      setMonth(lastMonth);
    }
  }, [performance]);

  const handleSliderChange = (item, newValue) => {
    setSliderValue((prevState) => ({
      ...prevState,
      [item.statRange]: newValue,
    }));
  };

  const handleEdit = (index) => {
    setIsEditMode(true);
    setEditIndex(index);
    const statValue = data[index].statValue;
    const userValue = performance.find((item) => item.month === month)
      ?.ValueArray?.[index]?.UserValue;
    setUpdatedValue(statValue);
    setSliderValue((prevState) => ({
      ...prevState,
      [statValue]: userValue || 0,
    }));
  };

  useEffect(() => {
    localStorage.setItem("statData", JSON.stringify(statsData));
  }, [statsData]);

  const handleSave = (index, item) => {
    setIsEditMode(false);
    const updatedStat = updatedValue;
    const updatedUserValue = sliderValue[item.statRange] || 0;
    const updatedMonth = month;
    const updatedPerformance = performance.map((performanceItem) => {
      if (performanceItem.month === updatedMonth) {
        const updatedValueArray = performanceItem.ValueArray.map(
          (valueItem, valueIndex) => {
            if (valueIndex === index) {
              return {
                ...valueItem,
                UserValue: updatedUserValue,
                StatType: updatedValue,
              };
            }
            return valueItem;
          }
        );
        return {
          ...performanceItem,
          ValueArray: updatedValueArray,
        };
      }
      return performanceItem;
    });

    console.log(index);

    // Update API
    axios
      .put(`http://localhost:3012/employee/${ind}`, {
        emp_Stats: updatedPerformance,
      })
      .then((res) => {
        console.log("API updated:", res.data);
      })
      .catch((error) => {
        console.error("Error updating API:", error);
      });

    // Update local storage
    const updatedStatData = data.map((dataItem, dataIndex) => {
      if (dataIndex === index) {
        return {
          ...dataItem,
          statValue: updatedStat,
        };
      }
      return dataItem;
    });

    localStorage.setItem("statData", JSON.stringify(updatedStatData));

    // Update state
    setPerformance(updatedPerformance);
    setData(updatedStatData);
  };

  console.log(performance);
  console.log(data);

  return (
    <Container>
      <Box>
        <Typography variant="h3" className={classes.title} gutterBottom>
          Update {name} Stats
        </Typography>
        <Typography variant="h6">Select Month of Stats</Typography>
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
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {data.map((item, index) => {
            const userValue = performance.find((item) => item.month === month)
              ?.ValueArray?.[index]?.UserValue;
            return (
              <Grid key={item.statValue}>
                <Card
                  sx={{
                    minWidth: "300px",
                    boxShadow: "20px 20px 40px grey",
                    m: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="60"
                    style={{ backgroundColor: "purple" }}
                  />
                  <CardContent>
                      <Typography variant="h6">{item.statValue}</Typography>
                  </CardContent>

                  <CardActions>
                    <Box sx={{ width: "100%", marginLeft: 6 }}>
                      {!isEditMode || editIndex !== index ? (
                        <>
                          <Typography>
                            Rate Value: {userValue || 0} out of{" "}
                            {Number(item.statRange)}
                          </Typography>
                          <Slider
                            min={0}
                            max={Number(item.statRange)}
                            value={
                              performance.find((item) => item.month === month)
                                ?.ValueArray?.[index]?.UserValue || 0
                            }
                            style={{
                              marginLeft: 6,
                              marginTop: 10,
                              width: "80%",
                            }}
                            valueLabelDisplay="auto"
                          />
                        </>
                      ) : (
                        <Slider
                          min={0}
                          max={Number(item.statRange)}
                          value={sliderValue[item.statRange] || 0}
                          style={{ marginLeft: 6, marginTop: 10, width: "80%" }}
                          valueLabelDisplay="auto"
                          onChange={(event, newValue) =>
                            handleSliderChange(item, newValue)
                          }
                        />
                      )}
                    </Box>
                    <div style={{ marginLeft: "auto" }}>
                      {!isEditMode || editIndex !== index ? (
                        <>
                          <Button
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(index)}
                          />
                        </>
                      ) : (
                        <Button
                          color="primary"
                          onClick={() => handleSave(index, item)}
                          startIcon={<SaveIcon />}
                        />
                      )}
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </div>
      </Box>
    </Container>
  );
};

export default UserSideStats;
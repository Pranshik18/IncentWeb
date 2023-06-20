import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CardMedia, Container, Grid } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const CardComponent = () => {
  const classes = useStyles();
  const [month, setMonth] = useState();
  const [data, setData] = useState([]);
  const [sliderValue, setSliderValue] = useState({});
  const [particularIndexData, setparticularIndexData] = useState({});
  const [modifiedBy, setModifiedBy] = useState("Admin");
  const index = localStorage.getItem("index");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3012/employee/${index}`).then((res) => {
      setparticularIndexData(res.data);
    });

    setData(JSON.parse(localStorage.getItem("statData")));
  }, []);
  console.log(sliderValue);
  console.log(particularIndexData);

  const handleSubmit = (e) => {
    window.location.reload(true);
    console.log(data);
    const ValueArray = data.map((item) => ({
      StatType: item.statValue,
      UserValue: sliderValue[item.statRange] || 0,
      UserMaxValue: item.statRange || 0,
    }));
    console.log(month);
    console.log(ValueArray);

    const newValue = {
      month: month,
      ValueArray: ValueArray,
    };
    console.log(newValue);

    const existingMonthIndex = particularIndexData.emp_Stats.findIndex(
      (stat) => stat.month === month
    );
    if (existingMonthIndex !== -1) {
      // Update existing stats for the month
      const updatedStats = particularIndexData.emp_Stats.map((stat, index) =>
        index === existingMonthIndex ? newValue : stat
      );
      const updatedValue = {
        ...particularIndexData,
        emp_Stats: updatedStats,
        modifiedBy: modifiedBy,
      };

      axios.put(`http://localhost:3012/employee/${index}`, updatedValue).then((res) => {
        console.log("Success");
      });
    } else {
      // Add new stats for the month
      const updatedValue = {
        ...particularIndexData,
        emp_Stats: [...particularIndexData.emp_Stats, newValue],
        modifiedBy: modifiedBy,
      };

      axios.put(`http://localhost:3012/employee/${index}`, updatedValue).then((res) => {
        console.log("Success");
      });
    }
  };

  return (
    <Container>
      <Box>
        <Typography variant="h3" className={classes.title} gutterBottom>
          Your Stats
        </Typography>
        <Typography variant="h6">Select Month of Stats</Typography>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={classes.title}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {data.map((item) => {
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
                    <Box sx={{ width: "250" }}>
                      <Typography>
                        Rate Value: {sliderValue[item.statRange] || 0}
                      </Typography>
                      <Slider
                        min={0}
                        max={Number(item.statRange)}
                        value={sliderValue[item.statRange] || 0}
                        onChange={(e) =>
                          setSliderValue((prevSliderVal) => ({
                            ...prevSliderVal,
                            [item.statRange]: e.target.value,
                          }))
                        }
                        style={{ marginLeft: 6 }}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </div>
        <div className={classes.button}>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            className={classes.btn}
          >
            Submit
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default CardComponent;

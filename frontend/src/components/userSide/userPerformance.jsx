import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Speedometer from "react-d3-speedometer";
import SelectAutoWidth from "./Select";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContent: {
    marginTop: theme.spacing(8),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    },
    speedometer: {
      padding:'10px'
  }
}));

const NavbarComponent = () => {
  const classes = useStyles();
  const speedometerData = [
    { min: 0, max: 100, value: 50 },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Dashboard</Typography>
                  <Box marginLeft="auto">
          </Box>
        </Toolbar>
      </AppBar>
          <SelectAutoWidth />
    </>
  );
};

export default NavbarComponent;

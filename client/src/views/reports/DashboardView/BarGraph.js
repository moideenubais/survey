import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  makeStyles,
  colors,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import { find, isEmpty } from "lodash";
import CustomDateRange from "../../../components/DateRangePicker";

const useStyles = makeStyles(() => ({
  root: {},
}));

const Sales = ({ className, dataLabels, dataValues, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        data: dataValues,
        label: rest.tooltip,
      },
    ],
    labels: dataLabels,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            beginAtZero: true,
            fontColor: theme.palette.text.secondary,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider,
          },
        },
      ],
    },
  };

  return (
    data && (
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader title={rest.title} />
        <Divider />
        <CardContent>
          <Box height={400} position="relative">
            <Bar data={data} options={options} />
          </Box>
        </CardContent>
        <Divider />
      </Card>
    )
  );
};

Sales.propTypes = {
  className: PropTypes.string,
};

export default Sales;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { weeklyRetentionObject } from "models";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const RetentionCohort: React.FC = () => {
  const [retentionData, setRetentionData] = useState<weeklyRetentionObject[]>([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const { data: retentionData } = await axios.get(`http://localhost:3001/events/retention`, {
        params: {
          dayZero: "1601672400000",
        },
      });
      setRetentionData(retentionData);
    };
    fetchData();
  }, []);

  console.log(retentionData);

  return (
    <div>
      <h1>Retention</h1>
      {retentionData.length > 0 ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {retentionData.map((weeklyData) => (
                  <TableCell key={weeklyData.registrationWeek} align="right">
                    week {weeklyData.registrationWeek}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {retentionData.map((weekData) => (
                <TableRow key={weekData.registrationWeek}>
                  <TableCell component="th" scope="row">
                    {weekData.start} - {weekData.end}
                    <br />
                    {weekData.newUsers} new users
                  </TableCell>
                  {weekData.weeklyRetention.map((weeklyRetentionData, i) => (
                    <TableCell key={i} align="right">
                      {weeklyRetentionData}%
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h1>no data to show</h1>
      )}
    </div>
  );
};

export default RetentionCohort;

import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Header from 'components/styles/Header';
import TileDiv from "components/styles/TileDiv";

const SessionsDays: React.FC = () => {
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      const dayInMilliseconds: number = 1000 * 60 * 60 * 24;
      const offset: number = Math.ceil(
        (new Date().setHours(0, 0, 0, 0) - date.getTime()) / dayInMilliseconds
      );
      console.log(offset);
      const { data: sessionByDay } = await axios.get(
        `http://localhost:3001/events/by-days/${offset}`
      );
      setSessions(sessionByDay);
    };
    fetchData();
  }, [date]);

  const dateFormatter = (date: Date): string => {
    const day: string | number =
      date.getDate().toString().length === 1 ? `0${date.getDate()}` : date.getDate();
    let month: string | number = date.getMonth() + 1;
    month = month >= 10 ? month : `0${month}`;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (newDate: string): void => {
    console.log(newDate);
    setDate(new Date(newDate));
  };

  return (
    <TileDiv>
      <Header>
        <h1>Sessions (days)</h1>
        <form noValidate>
          <TextField
            className="date"
            label="Date"
            type="date"
            value={dateFormatter(date)}
            onChange={(e) => handleDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </form>
      </Header>
      <LineChart width={500} height={200} data={sessions}>
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <Legend layout="vertical" align="left" verticalAlign="middle" />
        <Tooltip />
        <YAxis />
      </LineChart>
    </TileDiv>
  );
};

export default SessionsDays;

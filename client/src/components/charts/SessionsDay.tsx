import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import axios from "axios";

const SessionsDay: React.FC = () => {
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
    <div>
      <h1>Session day</h1>
      <input
        type="date"
        value={dateFormatter(date)}
        max={dateFormatter(new Date())}
        onChange={(e) => handleDateChange(e.target.value)}
      ></input>
      <LineChart width={600} height={300} data={sessions}>
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis />
      </LineChart>
    </div>
  );
};

export default SessionsDay;

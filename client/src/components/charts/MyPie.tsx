import React, { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "models";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import TileDiv from "components/styles/TileDiv";

type counterObj = {
  name: string;
  count: number;
};

type Props = {
  typeOfPie: string;
};

const counter = (data: string[]) => {
  const counterArr: counterObj[] = [];
  for (let i = 0; i < data.length; i++) {
    const checker: number = counterArr.findIndex((e) => e.name === data[i]);
    if (checker === -1) {
      const newCounterObj: counterObj = {
        name: data[i],
        count: 1,
      };
      counterArr.push(newCounterObj);
    } else {
      counterArr[checker].count++;
    }
  }
  return counterArr;
};

const MyPie: React.FC<Props> = ({ typeOfPie }) => {
  const [counts, setCounts] = useState<counterObj[]>([]);

  const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333"];

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: events } = await axios.get(`http://localhost:3001/events/all`);
      const filteredEvents: string[] = events.map((e: Event) =>
        typeOfPie === "url"
          ? e.url.replace("http://localhost3000", "")
          : typeOfPie === "os"
          ? e.os
          : typeOfPie === "browser" && e.browser
      );
      setCounts(counter(filteredEvents));
      console.log(counter(filteredEvents));
    };
    fetchData();
  }, []);

  return (
    <TileDiv>
      <h1>{typeOfPie} Pie</h1>
      <PieChart width={300} height={200}>
        <Pie data={counts} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={50} label>
          {counts.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend layout="vertical" align="left" verticalAlign="middle" />
      </PieChart>
    </TileDiv>
  );
};

export default MyPie;

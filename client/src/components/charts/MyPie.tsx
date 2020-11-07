import React, { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "models";
import { PieChart, Pie, Tooltip } from "recharts";

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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: events } = await axios.get(`http://localhost:3001/events/all`);
      const filteredEvents: string[] = events.map((e: Event) =>
        typeOfPie === "url" ? e.url : typeOfPie === "os" && e.os
      );
      setCounts(counter(filteredEvents));
      console.log(counter(filteredEvents));
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>{typeOfPie.toUpperCase()} Pie</h1>
      <PieChart width={730} height={250}>
        <Pie
          data={counts}
          dataKey="count"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
          fill="#8884d8"
        />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default MyPie;

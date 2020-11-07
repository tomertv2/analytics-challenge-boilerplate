import React, { useEffect, useState } from "react";
import axios from "axios";
import { Event } from "models";
import { PieChart, Pie, Tooltip } from "recharts";

type urlObj = {
  name: string;
  count: number;
};

const UrlCounter = (urls: string[]) => {
  const urlArr: urlObj[] = [];
  for (let i = 0; i < urls.length; i++) {
    const checker: number = urlArr.findIndex((e) => e.name === urls[i]);
    if (checker === -1) {
      const newUrl: urlObj = {
        name: urls[i],
        count: 1,
      };
      urlArr.push(newUrl);
    } else {
      urlArr[checker].count++;
    }
  }
  return urlArr;
};

const UrlPie: React.FC = () => {
  const [urlCounts, setUrlCounts] = useState<urlObj[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: eventsUrl } = await axios.get(`http://localhost:3001/events/all`);
      const filteredEvents: string[] = eventsUrl.map((e: Event) => e.url);
      setUrlCounts(UrlCounter(filteredEvents));
      console.log(UrlCounter(filteredEvents));
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>URL Pie</h1>
      <PieChart width={730} height={250}>
        <Pie
          data={urlCounts}
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

export default UrlPie;

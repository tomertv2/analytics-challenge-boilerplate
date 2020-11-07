import React, { useEffect, useState } from "react";
import axios from "axios";
import { Event, eventName } from "models";

const UrlCounter = (events: string[]) => {
    
}

const UrlPie: React.FC = () => {
  const [urlCounts, setUrlCounts] = useState([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: eventsUrl } = await axios.get(`http://localhost:3001/events/all`);
      setUrlCounts(eventsUrl.map((e: Event) => e.name));
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>URL Pie</h1>
    </div>
  );
};

export default UrlPie;

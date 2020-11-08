import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { eventName, browser, Event } from "models";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Avatar from '@material-ui/core/Avatar';
import TileDiv from "components/styles/TileDiv";

type sort = "+date" | "-date";

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Log: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [more, setMore] = useState<boolean>(false);
  const [sort, setSort] = useState<sort>("+date");
  const [type, setType] = useState<eventName | undefined>(undefined);
  const [browser, setBrowser] = useState<browser | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(10);

  const fetchData = async (setter: number) => {
    const { data: sessionsByDay } = await axios.get(`http://localhost:3001/events/all-filtered`, {
      params: {
        sort: sort,
        ...(type !== undefined ? { type: type } : {}),
        ...(browser !== undefined ? { browser: browser } : {}),
        ...(search.length > 0 ? { search: search } : {}),
        offset: setter,
      },
    });
    setEvents(sessionsByDay.events);
    setMore(sessionsByDay.more);
  };

  useEffect(() => {
    fetchData(10);
  }, [sort, type, browser, search]);

  const handleSearchChange = (value: string): void => {
    setSearch(value);
  };

  const handleSortChange = (value: string): void => {
    if (value === "+date" || value === "-date") {
      setSort(value);
    }
  };

  const handleTypeChange = (value: string): void => {
    if (value === "all") {
      setType(undefined);
    }
    if (value === "login" || value === "signup" || value === "admin") {
      setType(value);
    }
  };

  const handleBrowserChange = (value: string): void => {
    if (value === "all") {
      setBrowser(undefined);
    }
    if (
      value === "chrome" ||
      value === "safari" ||
      value === "edge" ||
      value === "firefox" ||
      value === "ie" ||
      value === "other"
    ) {
      setBrowser(value);
    }
  };

  const handleNext = () => {
    fetchData(offset + 10);
    setOffset((value) => value + 10);
  };

  return (
    <TileDiv>
      <h1>Events Log</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
      ></input>
      <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="+date">+Date</option>
        <option value="-date">-Date</option>
      </select>
      <select value={type} onChange={(e) => handleTypeChange(e.target.value)}>
        <option value="all">All</option>
        <option value="login">Login</option>
        <option value="signup">Signup</option>
        <option value="admin">Admin</option>
      </select>
      <select value={browser} onChange={(e) => handleBrowserChange(e.target.value)}>
        <option value="all">All</option>
        <option value="chrome">Chrome</option>
        <option value="safari">Safari</option>
        <option value="edge">Edge</option>
        <option value="firefox">Firefox</option>
        <option value="ie">Internet Explorer</option>
        <option value="other">other</option>
      </select>
      <InfiniteScroll
        dataLength={events.length}
        next={handleNext}
        hasMore={more}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>You have seen it all</b>
          </p>
        }
        height={"50vh"}
      >
        {events.map((event: Event) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Avatar style={{backgroundColor: getRandomColor()}}>{' '}</Avatar>
              <Typography >Event {event._id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <div>Event name: {event.name}</div>
                <div>OS: {event.os}</div>
                <div>Browser: {event.browser}</div>
                <div>User Id: {event.distinct_user_id}</div>
                <div>Come from: {event.url}</div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </InfiniteScroll>
    </TileDiv>
  );
};

export default Log;

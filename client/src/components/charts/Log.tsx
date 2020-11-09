import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { eventName, browser, Event } from "models";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Avatar from "@material-ui/core/Avatar";
import LogStyle from "components/styles/LogStyle";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import TileDiv from "components/styles/TileDiv";

type sort = "+date" | "-date";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Log: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [more, setMore] = useState<boolean>(false);
  const [sort, setSort] = useState<sort>("+date");
  const [type, setType] = useState<eventName | "all">("all");
  const [browser, setBrowser] = useState<browser | "all">("all");
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(10);

  const fetchData = async (setter: number) => {
    const { data: sessionsByDay } = await axios.get(`http://localhost:3001/events/all-filtered`, {
      params: {
        sort: sort,
        ...(type !== "all" ? { type: type } : {}),
        ...(browser !== "all" ? { browser: browser } : {}),
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
    if (value === "all" || value === "login" || value === "signup" || value === "admin") {
      setType(value);
    }
  };

  const handleBrowserChange = (value: string): void => {
    if (
      value === "all" ||
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
      <LogStyle>
        <div>
          <TextField
            id="search"
            label="Search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <br />
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select
            labelId="sort-label"
            id="sort-select"
            value={sort}
            onChange={(event) => handleSortChange(event.target.value as string)}
          >
            <MenuItem value="+date">+Date</MenuItem>
            <MenuItem value="-date">-Date</MenuItem>
          </Select>
          <br />
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            id="type-select"
            value={type}
            onChange={(event) => handleTypeChange(event.target.value as string)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="signup">Signup</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
          <br />
          <InputLabel id="browser-label">Browser</InputLabel>
          <Select
            labelId="browser-label"
            id="browser-select"
            value={browser}
            onChange={(event) => handleBrowserChange(event.target.value as string)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="chrome">Chrome</MenuItem>
            <MenuItem value="safari">Safari</MenuItem>
            <MenuItem value="edge">Edge</MenuItem>
            <MenuItem value="firefox">Firefox</MenuItem>
            <MenuItem value="ie">Internet Explorer</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </div>

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
            <Accordion key={event._id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Avatar style={{ backgroundColor: getRandomColor() }}> </Avatar>
                <Typography>Event {event._id}</Typography>
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
      </LogStyle>
    </TileDiv>
  );
};

export default Log;

import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axios from "axios";
import { eventName, browser } from "models";

type sort = "+date" | "-date";

const Log: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [more, setMore] = useState<boolean>(false);
  const [sort, setSort] = useState<sort>("+date");
  const [type, setType] = useState<eventName | undefined>(undefined);
  const [browser, setBrowser] = useState<browser | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    const params = {
        sort: sort,
          ...(type !== undefined ? { type: type } : {}),
          ...(browser !== undefined ? { browser: browser } : {}),
          ...(search.length > 0 ? { search: search } : {}),
          ...(offset !== 0 ? { offset: offset } : {}),
    }
    const fetchData = async () => {
      const { data: sessionByDay } = await axios.get(`http://localhost:3001/events/all-filtered`, {
        params: {
          ...params
        },
      });
      setEvents(sessionByDay.events);
      setMore(sessionByDay.more);
    };
    fetchData();
  }, [sort, type, browser, search, offset]);

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

  const handleOffsetChange = (value: number): void => {
    setOffset(value);
  };

  return (
    <div>
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
      <input
        type="number"
        min="0"
        value={offset}
        onChange={(e) => handleOffsetChange(+e.target.value)}
      ></input>
      {/* <div style="height:700px;overflow:auto;">
    <InfiniteScroll
        pageStart={0}
        loadMore={loadFunc}
        hasMore={true || false}
        loader={<div className="loader" key={0}>Loading ...</div>}
        useWindow={false}
    >
        {items}
    </InfiniteScroll>
</div> */}
    </div>
  );
};

export default Log;

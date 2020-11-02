///<reference path="types.ts" />

import express from "express";
import { Request, Response } from "express";

// some useful database functions in here:
import db, {
} from "./database";
import { Event, weeklyRetentionObject } from "../../client/src/models/event";
import { ensureAuthenticated, validateMiddleware } from "./helpers";

import {
  shortIdValidation,
  searchValidation,
  userFieldsValidator,
  isUserValidator,
} from "./validators";
import { check } from "prettier";
import { session } from "passport";
const router = express.Router();

// Routes

interface Filter {
  sorting: string;
  type: string;
  browser: string;
  search: string;
  offset: number;
}

router.get("/all", (req: Request, res: Response) => {
  const events: Event[] = db.get("events").value();
  res.send(events);
});

router.get("/all-filtered", (req: Request, res: Response) => {
  const qFilter = req.query;
  let filteredEvents = db.get("events");
  let checkOffset: boolean = false;
  if (qFilter.sorting) {
    if (qFilter.sorting === "+date") {
      filteredEvents = filteredEvents.sortBy("date");
    } else if (qFilter.sorting === "-date") {
      filteredEvents = filteredEvents.sortBy("date").reverse();
    }
  }
  if (qFilter.type) {
    filteredEvents = filteredEvents.filter({ name: qFilter.type });
  }
  if (qFilter.browser) {
    filteredEvents = filteredEvents.filter({ browser: qFilter.browser });
  }
  if (qFilter.search) {
  }
  if (qFilter.offset) {
    const originalLength: number = filteredEvents.value().length;
    filteredEvents = filteredEvents.take(+qFilter.offset);
    if (originalLength > filteredEvents.value().length) {
      checkOffset = true;
    }
  }
  res.send({ events: filteredEvents.value(), more: checkOffset });
});

router.get("/by-days/:offset", (req: Request, res: Response) => {
  function getStartOfDay(dateNow: number): number {
    let year = new Date(dateNow).getFullYear();
    let day = new Date(dateNow).getDate();
    let month = new Date(dateNow).getMonth() + 1;
    const startOfDay = new Date(`${year}/${month}/${day}`);
    return startOfDay.getTime();
  }

  type returnObj = {
    date: string;
    count: number;
  };
  
  const dayInMilliseconds: number = 1000 * 60 * 60 * 24;
  const weekInMilliseconds: number = 1000 * 60 * 60 * 24 * 7;
  const offset: number = +req.params.offset;
  // Check the date before 'offset' days
  const dateToStart: number =
    getStartOfDay(Date.now() + dayInMilliseconds) - offset * dayInMilliseconds;
  // Check the date before a week
  const dateBeforeWeek: number = getStartOfDay(dateToStart) - weekInMilliseconds;
  const eventsByDays: Event[] = db
    .get("events")
    // Filter the events in the correct dates
    .filter((e: Event) => e.date <= dateToStart && e.date >= dateBeforeWeek)
    .value();

  const eventsDates: { date: number; sessionId: string }[] = eventsByDays.map((e) => ({
    date: e.date,
    sessionId: e.session_id,
  }));

  const byDaysArr: returnObj[] = [];
  for (let i = 0; i < eventsDates.length; i++) {
    let isExist: boolean = false;
    for (let j = 0; j < byDaysArr.length; j++) {
      if (new Date(eventsDates[i].date).toLocaleDateString() === byDaysArr[j].date) {
        byDaysArr[j].count++;
        isExist = true;
      }
    }
    if (!isExist) {
      byDaysArr[byDaysArr.length] = {
        date: new Date(eventsDates[i].date).toLocaleDateString(),
        count: 1,
      };
    }
  }
  res.send(byDaysArr);
});

router.get("/by-hours/:offset", (req: Request, res: Response) => {
  type returnObj = {
    hour: string;
    count: number;
  };

  const offset: number = +req.params.offset;
  const dayInMilliseconds: number = 1000 * 60 * 60 * 24;
  const chosenDate: Date = new Date(Date.now() - offset * dayInMilliseconds);
  const chosenDay: number = chosenDate.getDate();
  const chosenMonth: number = chosenDate.getMonth();
  const chosenYear: number = chosenDate.getFullYear();
  const eventsByHours: Event[] = db
    .get("events")
    // filter by day
    .filter((e) => new Date(e.date).getDate() === chosenDay)
    // filter by month
    .filter((e) => new Date(e.date).getMonth() === chosenMonth)
    // filter by year
    .filter((e) => new Date(e.date).getFullYear() === chosenYear)
    // sort by date
    .sortBy("date")
    .value();

  const byHoursArr: returnObj[] = [
    {
      hour: "00:00",
      count: 0,
    },
    {
      hour: "01:00",
      count: 0,
    },
    {
      hour: "02:00",
      count: 0,
    },
    {
      hour: "03:00",
      count: 0,
    },
    {
      hour: "04:00",
      count: 0,
    },
    {
      hour: "05:00",
      count: 0,
    },
    {
      hour: "06:00",
      count: 0,
    },
    {
      hour: "07:00",
      count: 0,
    },
    {
      hour: "08:00",
      count: 0,
    },
    {
      hour: "09:00",
      count: 0,
    },
    {
      hour: "10:00",
      count: 0,
    },
    {
      hour: "11:00",
      count: 0,
    },
    {
      hour: "12:00",
      count: 0,
    },
    {
      hour: "13:00",
      count: 0,
    },
    {
      hour: "14:00",
      count: 0,
    },
    {
      hour: "15:00",
      count: 0,
    },
    {
      hour: "16:00",
      count: 0,
    },
    {
      hour: "17:00",
      count: 0,
    },
    {
      hour: "18:00",
      count: 0,
    },
    {
      hour: "19:00",
      count: 0,
    },
    {
      hour: "20:00",
      count: 0,
    },
    {
      hour: "21:00",
      count: 0,
    },
    {
      hour: "22:00",
      count: 0,
    },
    {
      hour: "23:00",
      count: 0,
    },
  ];

  for (let i = 0; i < eventsByHours.length; i++) {
    const temp: number = new Date(eventsByHours[i].date).getHours();
    byHoursArr[temp].count++;
  }
  res.send(byHoursArr);
});

router.get('/today', (req: Request, res: Response) => {
  res.send('/today')
});

router.get('/week', (req: Request, res: Response) => {
  res.send('/week')
});

router.get('/retention', (req: Request, res: Response) => {
  const {dayZero} = req.query
  res.send('/retention')
});
router.get('/:eventId',(req : Request, res : Response) => {
  res.send('/:eventId')
});

router.post('/', (req: Request, res: Response) => {
  res.send('/')
});

router.get('/chart/os/:time',(req: Request, res: Response) => {
  res.send('/chart/os/:time')
})

  
router.get('/chart/pageview/:time',(req: Request, res: Response) => {
  res.send('/chart/pageview/:time')
})

router.get('/chart/timeonurl/:time',(req: Request, res: Response) => {
  res.send('/chart/timeonurl/:time')
})

router.get('/chart/geolocation/:time',(req: Request, res: Response) => {
  res.send('/chart/geolocation/:time')
})


export default router;

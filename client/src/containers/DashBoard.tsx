import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import SessionsDays from "components/charts/SessionsDays";
import SessionsHours from "components/charts/SessionsHours";
import Map from "components/charts/Map";
import Log from "components/charts/Log";
import RetentionCohort from "components/charts/RetentionCohort";
import MyPie from "components/charts/MyPie";
import ErrorBoundary from "components/ErrorBoundary";
import Tiles from "components/styles/Tiles";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div>
      <h1>Analytics</h1>
      <Tiles>
        <ErrorBoundary>
          <SessionsDays />
        </ErrorBoundary>
        <ErrorBoundary>
          <SessionsHours />
        </ErrorBoundary>
        <ErrorBoundary>
          <MyPie typeOfPie="url" />
        </ErrorBoundary>
        <ErrorBoundary>
          <MyPie typeOfPie="os" />
        </ErrorBoundary>
        <ErrorBoundary>
          <MyPie typeOfPie="browser" />
        </ErrorBoundary>
        <ErrorBoundary>
          <Map />
        </ErrorBoundary>
        <ErrorBoundary>
          <RetentionCohort />
        </ErrorBoundary>
        <ErrorBoundary>
          <Log />
        </ErrorBoundary>
      </Tiles>
    </div>
  );
};

export default DashBoard;

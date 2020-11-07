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

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div>
      <h1>Analytics</h1>
      <ErrorBoundary>
        <SessionsDays />
      </ErrorBoundary>
      <ErrorBoundary>
        <SessionsHours />
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
      <ErrorBoundary>
        <MyPie typeOfPie="url" />
      </ErrorBoundary>
      <ErrorBoundary>
        <MyPie typeOfPie="os" />
      </ErrorBoundary>
    </div>
  );
};

export default DashBoard;

import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import SessionsDays from "components/charts/SessionsDays";
import SessionsHours from "components/charts/SessionsHours";
import Map from 'components/charts/Map';
import Log from 'components/charts/Log';
import RetentionCohort from 'components/charts/RetentionCohort';
import UrlPie from 'components/charts/UrlPie';

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div>
      <h1>Analytics</h1>
      <SessionsDays />
      <SessionsHours />
      <Map />
      <RetentionCohort />
      <Log />
      <UrlPie />
    </div>
  );
};

export default DashBoard;

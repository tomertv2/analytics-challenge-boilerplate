import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import SessionsDays from "../components/charts/SessionsDays";
import SessionsHours from "../components/charts/SessionsHours";
import Map from '../components/charts/Map';

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
    </div>
  );
};

export default DashBoard;

import React from "react";
import { Interpreter } from "xstate";
import { AuthMachineContext, AuthMachineEvents } from "../machines/authMachine";
import SessionsDay from "../components/charts/SessionsDay";

export interface Props {
  authService: Interpreter<AuthMachineContext, any, AuthMachineEvents, any>;
}

const DashBoard: React.FC = () => {
  return (
    <div>
      <h1>Analytics</h1>
      <SessionsDay />
    </div>
  );
};

export default DashBoard;

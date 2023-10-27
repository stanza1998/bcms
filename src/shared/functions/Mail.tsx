import React from "react";
import { observer } from "mobx-react-lite";
import { useAppContext } from "./Context";

export const Reminder = observer(() => {
  const { store, api } = useAppContext();

  // api.mail.sendMail("", "", "", "", "");

  return <div>This is a Reminder component</div>; // Replace with your actual content
});
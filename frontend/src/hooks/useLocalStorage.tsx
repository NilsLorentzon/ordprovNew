import React from "react";
import { LocalStorageContext } from "../providers/LocalStorageProvider";

export default function useLocalStorage() {
  const value = React.useContext(LocalStorageContext);

  return value;
}

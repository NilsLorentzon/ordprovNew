// @ts-nocheck
import React from "react";
import { axios } from "../lib/axios";
import ErrorFallback from "../features/Misc/ErrorFallback";

export default class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    axios.post("log", { error, info: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

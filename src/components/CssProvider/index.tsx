import { createGenerateClassName, StylesProvider } from "@material-ui/core";
import React from "react";

const generateClassName = createGenerateClassName({
  productionPrefix: "assessment",
  seed: "assessment",
});

export default function CssProvider(props: { children: React.ReactNode }) {
  return <StylesProvider generateClassName={generateClassName}>{props.children}</StylesProvider>;
}
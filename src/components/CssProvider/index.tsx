import { buildTheme, ThemeProvider } from "@kl-engineering/kidsloop-px";
import { createGenerateClassName, StylesProvider } from "@mui/styles";
import React from "react";

const generateClassName = createGenerateClassName({
  productionPrefix: "assessment",
  seed: "assessment",
});

// export default function CssProvider(props: { children: React.ReactNode }) {
//   return <StylesProvider generateClassName={generateClassName}>{props.children}</StylesProvider>;
// }

export default function CssProvider(props: { children: React.ReactNode }) {
  const theme = buildTheme({ locale: `en` });

  return (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </StylesProvider>
  );
}

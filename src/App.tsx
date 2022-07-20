import { ApolloProvider } from "@apollo/client";
import { ConfirmDialog } from "@components/ConfirmDialog";
import { Loading } from "@components/Loading";
import { Locale } from "@components/Locale";
import { Notification } from "@components/Notification";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { createGenerateClassName, StylesProvider } from "@mui/styles";
import { DetailAssessment } from "@pages/DetailAssessment";
import { ListAssessment } from "@pages/ListAssessment";
import { OutcomeList } from "@pages/OutcomeList";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { gqlapi } from "./api";
import MilestoneEdit from "./pages/MilestoneEdit";
import MilestonesList from "./pages/MilestoneList";
import { default as CreateOutcome, default as CreateOutcomings } from "./pages/OutcomeEdit";
import { store } from "./reducers";
import theme from "./theme";
// import { Test } from "@pages/test";
const generateClassName = createGenerateClassName({
  productionPrefix: "assessment",
  seed: "assessment",
});
function App() {
  return (
    <ApolloProvider client={gqlapi}>
      <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StylesProvider generateClassName={generateClassName}>
          <HashRouter>
            <Provider store={store}>
              <Locale>
                <Loading />
                <SnackbarProvider>
                  <Switch>
                    <Route path={OutcomeList.routeBasePath}>
                      <OutcomeList />
                    </Route>
                    <Route path={ListAssessment.routeBasePath}>
                      <ListAssessment />
                    </Route>
                    <Route path={DetailAssessment.routeBasePath}>
                      <DetailAssessment />
                    </Route>
                    <Route path={CreateOutcomings.routeBasePath}>
                      <CreateOutcome />
                    </Route>
                    <Route path={MilestonesList.routeBasePath}>
                      <MilestonesList />
                    </Route>
                    <Route path={MilestoneEdit.routeMatchPath}>
                      <MilestoneEdit />
                    </Route>
                    {/*<Route path={Test.routeBasePath}>*/}
                    {/*  <Test />*/}
                    {/*</Route>*/}
                    <Route path="/">
                      <Redirect to={ListAssessment.routeRedirectDefault} />
                    </Route>
                  </Switch>
                  <Notification />
                  <ConfirmDialog />
                </SnackbarProvider>
              </Locale>
            </Provider>
          </HashRouter>
        </StylesProvider>
      </ThemeProvider>
      </StyledEngineProvider>
    </ApolloProvider>
  );
}

export default App;

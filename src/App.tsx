import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { gqlapi } from "./api";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Loading } from "./components/Loading";
import { Locale } from "./components/Locale";
import { Notification } from "./components/Notification";
import { DetailAssessment } from "./pages/DetailAssessment";
import { ListAssessment } from "./pages/ListAssessment";
import MilestoneEdit from "./pages/MilestoneEdit";
import MilestonesList from "./pages/MilestoneList";
import { default as CreateOutcome, default as CreateOutcomings } from "./pages/OutcomeEdit";
import { OutcomeList } from "./pages/OutcomeList";
// import { StudyAssessmentList } from "./pages/StudyAssessmentList";
import { store } from "./reducers";
import theme from "./theme";

function App() {
  return (
    <ApolloProvider client={gqlapi}>
      <ThemeProvider theme={theme}>
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
                  <Route path="/">
                    <Redirect to={ListAssessment.routeBasePath} />
                  </Route>
                </Switch>
                <Notification />
                <ConfirmDialog />
              </SnackbarProvider>
            </Locale>
          </Provider>
        </HashRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;

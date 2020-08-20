import React from "react";
import MyContentList from "./pages/MyContentList/index";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import theme from "./theme";
import ContentEdit from "./pages/ContentEdit";
import { ThemeProvider } from "@material-ui/core";
import Preview from "./pages/Preview";
import { store } from "./reducers";
import { Provider } from "react-redux";
import HeaderNavBar from "./pages/MyContentList/HeaderNavBar";
import Schedule from "./pages/Schedule";
import ContentDetail from "./pages/ContentDetail";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Provider store={store}>
          <HeaderNavBar />
          <Switch>
            <Route path={Preview.routeBasePath}>
              <Preview />
            </Route>
            <Route path={ContentEdit.routeMatchPath}>
              <ContentEdit />
            </Route>
            <Route path={ContentEdit.routeBasePath}>
              <Redirect to={ContentEdit.routeRedirectDefault} />
            </Route>
            <Route path={ContentDetail.routeBasePath}>
              <ContentDetail />
            </Route>
            <Route path="/library/my-content-list">
              <MyContentList />
            </Route>
            <Route path="/schedule" component={Schedule} />
            {/* <Route path="/">
              <Redirect to="/library/my-content-list?layout=card" />
            </Route> */}
          </Switch>
        </Provider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;

import { Checkbox, FormControlLabel, Grid, withStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import FormControl from "@material-ui/core/FormControl";
import Grow from "@material-ui/core/Grow/Grow";
import Hidden from "@material-ui/core/Hidden";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputBase from "@material-ui/core/InputBase/InputBase";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList/MenuList";
import NativeSelect from "@material-ui/core/NativeSelect/NativeSelect";
import Paper from "@material-ui/core/Paper/Paper";
import Popper from "@material-ui/core/Popper/Popper";
// import ButtonGroup from "@material-ui/core/ButtonGroup";
// import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography";
import {
  ArchiveOutlined,
  HourglassEmptyOutlined,
  MoreHoriz,
  PermMediaOutlined,
  PublishOutlined,
  // DescriptionOutlined,
  Search,
  ViewListOutlined,
  ViewQuiltOutlined,
} from "@material-ui/icons";
import React from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import LayoutBox from "../../components/LayoutBox";
// @ts-ignore
const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 13px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

// @ts-ignore
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
  nav: {
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "3px",
    textTransform: "capitalize",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    marginRight: "22px",
  },
  navigation: {
    padding: "20px 0px 10px 0px",
  },
  searchText: {
    width: "34%",
  },
  actives: {
    color: "#0E78D5",
  },
  tabMb: {
    textAlign: "right",
    position: "relative",
  },
  switchBtn: {
    width: "60px",
    height: "40px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tabs: {
    minHeight: "42px",
    height: "42px",
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return <div>{value === index && <Typography>{children}</Typography>}</div>;
}

function SecondaryMenu(props: ActionBarProps) {
  const classes = useStyles();
  const { layout, status } = props;
  const path = `#/library/my-content-list?layout=${layout}`;
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3}>
            <Grid item md={3} lg={5} xl={7}>
              <Button variant="contained" color="primary" className={classes.createBtn}>
                Create +
              </Button>
            </Grid>
            <Grid container direction="row" justify="space-evenly" alignItems="center" item md={9} lg={7} xl={5}>
              {/* <Button
                href={`${path}&status=content`}
                className={`${classes.nav} ${status === "content" ? classes.actives : ""}`}
                startIcon={<DescriptionOutlined />}
              >
                My Content
              </Button> */}
              <Button
                href={`${path}&status=published`}
                className={`${classes.nav} ${status === "published" ? classes.actives : ""}`}
                startIcon={<PublishOutlined />}
              >
                Published
              </Button>
              <Button
                href={`${path}&status=pending`}
                className={`${classes.nav} ${status === "pending" ? classes.actives : ""}`}
                startIcon={<HourglassEmptyOutlined />}
              >
                Pending
              </Button>
              <Button
                href={`${path}&status=unpublished`}
                className={`${classes.nav} ${status === "unpublished" ? classes.actives : ""}`}
                startIcon={<PublishOutlined />}
              >
                Unpublished
              </Button>
              <Button
                href={`${path}&status=archived`}
                className={`${classes.nav} ${status === "archived" ? classes.actives : ""}`}
                startIcon={<ArchiveOutlined />}
              >
                Archived
              </Button>
              <Button
                href={`${path}&status=assets`}
                className={`${classes.nav} ${status === "assets" ? classes.actives : ""}`}
                startIcon={<PermMediaOutlined />}
              >
                Assets
              </Button>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
      <SecondaryMenuMb layout={layout} />
    </div>
  );
}

function SecondaryMenuMb(props: ActionBarLayout) {
  const classes = useStyles();
  const { layout } = props;
  const path = `/library/my-content-list?layout=${layout}`;
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppBar position="static" color="inherit">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
              >
                <Tab label="My Content" className={classes.capitalize} />
                <Tab label="Assets" className={classes.capitalize} />
                <Tab label="Published" className={classes.capitalize} />
                <Tab label="Pending" className={classes.capitalize} />
                <Tab label="Archived" className={classes.capitalize} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Redirect to={`${path}&status=content`} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Redirect to={`${path}&status=assets`} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Redirect to={`${path}&status=published`} />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Redirect to={`${path}&status=pending`} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <Redirect to={`${path}&status=archived`} />
            </TabPanel>
          </Grid>
        </Grid>
      </Hidden>
    </div>
  );
}

interface ActionBarLayout {
  layout: string;
}
function SelectTemplateMb(props: ActionBarLayout) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [value, setValue] = React.useState("");
  const { layout } = props;
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const renderUserMessage = () => {
    if (layout === "card") {
      return (
        <Link to="/my-content-list?layout=list" style={{ color: "black" }}>
          <ViewListOutlined style={{ fontSize: "40px", marginTop: "8px" }} />
        </Link>
      );
    } else {
      return (
        <Link to="/my-content-list?layout=card" style={{ color: "black" }}>
          <ViewQuiltOutlined style={{ fontSize: "40px", marginTop: "8px" }} />
        </Link>
      );
    }
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Grid container spacing={3}>
            <Grid item xs={8} sm={8}>
              <Button variant="contained" color="primary" className={classes.createBtn}>
                Create +
              </Button>
            </Grid>
            <Grid item xs={4} sm={4} className={classes.tabMb}>
              {renderUserMessage()}
              <MoreHoriz style={{ fontSize: "40px" }} onClick={handleToggle} />
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                style={{ position: "absolute", top: 30, right: 0, zIndex: 999 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                          <MenuItem onClick={handleClose}>Profile</MenuItem>
                          <MenuItem onClick={handleClose}>My account</MenuItem>
                          <MenuItem onClick={handleClose}>Logout</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
            <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
              <TextField
                id="outlined-multiline-flexible"
                style={{ width: "100%" }}
                label="Search"
                multiline
                rowsMax={4}
                value={value}
                onChange={handleChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

function SelectTemplate(props: ActionBarProps) {
  const history = useHistory();
  console.log(history);
  const classes = useStyles();
  const { layout } = props;
  const handleSearch = (event: any) => {};
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Grid container spacing={3} style={{ marginTop: "6px" }}>
            <Grid item md={10} lg={8} xl={8}>
              <BootstrapInput id="filled-multiline-static" className={classes.searchText} placeholder={"Search"} />
              <Button variant="contained" color="primary" className={classes.searchBtn} onClick={handleSearch}>
                <Search /> Search
              </Button>
            </Grid>
            <Grid container direction="row" justify="flex-end" alignItems="center" item md={2} lg={4} xl={4}>
              {props.showMyOnly ? (
                <FormControlLabel value="end" control={<Checkbox color="primary" />} label="My Only" labelPlacement="end" />
              ) : (
                ""
              )}

              {/* <ButtonGroup aria-label="outlined primary button group" className={classes.switch}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: layout === "card" ? "#FFFF" : "#0E78D5",
                    color: layout === "card" ? "black" : "#FFFF",
                  }}
                  className={classes.switchBtn}
                  href="#/my-content-list?layout=list"
                >
                  <Tooltip title="List">
                    <ViewListOutlined />
                  </Tooltip>
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: layout === "card" ? "#0E78D5" : "#FFFF",
                    color: layout === "card" ? "#FFFF" : "black",
                  }}
                  className={classes.switchBtn}
                  href="#/my-content-card?layout=card"
                >
                  <Tooltip title="Card">
                    <ViewQuiltOutlined />
                  </Tooltip>
                </Button>
              </ButtonGroup> */}
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
      <SelectTemplateMb layout={layout} />
    </div>
  );
}

interface StatusProps {
  status: string;
}
function ActionTemplate(props: StatusProps) {
  const history = useHistory();
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const [orderValue, setOrderValue] = React.useState("");
  const handleChange = (event: any) => {
    setValue(event.target.value);
  };
  const handleOrderChange = (event: any) => {
    setOrderValue(event.target.value);
  };
  const [tabValue, setTabValue] = React.useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };
  const { status } = props;
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <hr style={{ borderColor: "#e0e0e0" }} />
        <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
          <Grid item sm={6} xs={6} md={3}>
            <FormControl variant="outlined">
              <NativeSelect id="demo-customized-select-native" value={value} onChange={handleChange} input={<BootstrapInput />}>
                <option value={10}>Bulk Actions</option>
                <option value={20}>Remove</option>
                <option value={30}>Bulk Remove</option>
              </NativeSelect>
            </FormControl>
          </Grid>
          {status === "unpublished" ? (
            <Grid item md={6}>
              <Tabs
                className={classes.tabs}
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab href={``} label="Draft" />
                <Tab label="Waiting for Approval" />
                <Tab label="Rejected" />
              </Tabs>
            </Grid>
          ) : (
            <Hidden only={["xs", "sm"]}>
              <Grid item md={6}></Grid>
            </Hidden>
          )}
          <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
            <FormControl>
              <NativeSelect id="demo-customized-select-native" value={orderValue} onChange={handleOrderChange} input={<BootstrapInput />}>
                <option value="">Display By </option>
                <option value={10}>Material Name(A-Z)</option>
                <option value={20}>Material Name(Z-A)</option>
                <option value={30}>Created On(New-Old)</option>
                <option value={30}>Created On(Old-New)</option>
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>
      </LayoutBox>
    </div>
  );
}

interface ActionBarProps {
  layout: string;
  status: string;
  showMyOnly: boolean;
}
export default function ActionBar(props: ActionBarProps) {
  const { layout, status, showMyOnly } = props;
  const classes = useStyles();
  return (
    <div className={classes.navigation}>
      <SecondaryMenu layout={layout} status={status} showMyOnly={showMyOnly} />
      <SelectTemplate layout={layout} status={status} showMyOnly={showMyOnly} />
      <ActionTemplate status={status} />
    </div>
  );
}

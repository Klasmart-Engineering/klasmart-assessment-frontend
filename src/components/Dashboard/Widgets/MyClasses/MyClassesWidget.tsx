import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Grid, MenuItem, Select, SelectChangeEvent, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { RootState } from "@reducers/index";
import { getClassesByOrg, getClassWidget } from "@reducers/myclasseswidget";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    widgetContent: {
      width: 430,
      height: 400,
      margin: "100px auto",
      border: "1px solid red",
      padding: 20,
      background: "#ccc",
    },
    widgetTitle: {},
    widgetBody: {
      marginTop: 5,
      width: 378,
      height: 240,
      background: "#fff",
      borderRadius: 12,
    },
    widgetMain: {
      width: "100%",
      height: "100%",
      padding: 20,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    selectClasses: {
      borderRadius: 10,
      background: "#fff",
      position: "relative",
      "&>div": {
        "&>span": {
          fontSize: 14,
        },
        "&>span:nth-child(2)": {
          display: "none",
        },
      },
    },
    mask: {
      width: "100%",
      height: "100%",
      background: "rgba(3,3,3,.7)",
      position: "absolute",
      top: 0,
      left: 0,
      borderRadius: 12,
      display: "none",
      zIndex: 99,
      "&.isShow": {
        display: "block",
      },
    },
    menuItem: {
      justifyContent: "space-between",
      "&>span:nth-child(1)": {
        marginRight: 10,
      },
      "&>span": {
        fontSize: 14,
      },
      "&.Mui-selected": {
        background: "none",
      },
      "&.Mui-disabled": {
        opacity: 1,
        "&>span:nth-child(1)": {
          opacity: 0.3,
        },
      },
    },
    arrowDownBox: {
      position: "absolute",
      height: "100%",
      right: 10,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      "&>svg": {
        transition: "transform .5s ease",
      },
    },
    arrowDown: {
      transform: "rotate(-180deg)",
    },
    widgetInfo: {
      alignItems: "flex-start",
      "&>.MuiGrid-item": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "&>span": {
          textAlign: "center",
        },
        "&>span:nth-child(1)": {
          color: "#40B8F4",
          fontSize: 26,
        },
        "&>span:nth-child(2)": {
          fontSize: 12,
        },
      },
    },
    widgetBtns: {
      "&>.MuiGrid-item": {
        "&>.MuiButton-root": {
          width: "100%",
          height: 28,
          fontSize: 12,
          borderRadius: 14,
          padding: "6px 8px",
        },
        "&>.MuiButton-root:nth-child(1)": {
          marginBottom: 4,
        },
      },
    },
    widgeBtn: {
      backgroundColor: "#E4E4E4",
      color: "#696A70",
      "&:hover": {
        backgroundColor: "#E4E4E4",
        color: "#696A70",
      },
    },
  })
);

export default function MyClassesWidget() {
  const { classList, classWidget } = useSelector<RootState, RootState["myclasseswidget"]>((state) => state.myclasseswidget);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const [currentClass, setCurrentClass] = React.useState("no_class");
  const host = window.location.origin;

  console.log(
    "myclasses:",
    classList,
    "start_day:",
    moment().startOf("day").unix(),
    "end_day:",
    moment().endOf("day").unix() + 1,
    "start_week:",
    moment().startOf("isoWeek").unix(),
    "end_week:",
    moment().endOf("isoWeek").unix() + 1,
    "classWidget",
    classWidget
  );

  const getClassCount = async (class_id: string) => {
    await dispatch(
      getClassWidget({
        class_id,
        schedule_start_at_gte: moment().startOf("day").unix(),
        schedule_start_at_lt: moment().endOf("day").unix() + 1,
        schedule_due_at_lt: moment().endOf("day").unix() + 1,
        schedule_due_at_gte: moment().startOf("day").unix(),
        assessment_due_at_le: moment().endOf("isoWeek").unix() + 1,
      })
    );
  };

  const getMyClasses = async () => {
    const { payload } = (await dispatch(getClassesByOrg())) as unknown as PayloadAction<AsyncTrunkReturned<typeof getClassesByOrg>>;
    if (payload && payload.length > 0 && payload[0]?.class_id) {
      getClassCount(payload[0]?.class_id);
    }
  };

  useEffect(() => {
    if (classList && classList.length > 0 && classList[0]?.class_id) {
      setCurrentClass(classList[0]?.class_id);
    }
  }, [classList]);

  useEffect(() => {
    getMyClasses();
    // eslint-disable-next-line
  }, []);

  const handleSelectClass = (e: SelectChangeEvent<string>) => {
    setCurrentClass(e.target.value);
    getClassCount(e.target.value);
  };

  const handleSkipPage = (type: string) => {
    let routerParams = "";
    switch (type) {
      case "create":
        routerParams = `schedule/edit?class_id=${currentClass}&class_type=OfflineClass`;
        break;
      case "lesson":
        routerParams = `schedule?class_id=${currentClass}&class_type=OfflineClass,OnlineClass`;
        break;
      case "assign":
        routerParams = `schedule/edit?class_id=${currentClass}&class_type=homework`;
        break;
      case "homework":
        routerParams = `schedule?class_id=${currentClass}&class_type=homework`;
        break;
      case "assessment":
        routerParams = `assessments/assessment-list?page=1&status=Started,Draft,Complete&class_id=${currentClass}&due_at_le=${
          moment().endOf("isoWeek").unix() + 1
        }&only_current_user=true`;
        break;
      case "report":
        routerParams = `report/achievement-list`;
        break;
      default:
        break;
    }
    window.open(`${host}/#/${routerParams}`);
  };

  return (
    <div className={classes.widgetContent}>
      <div className={classes.widgetTitle}>my classess</div>
      <div className={classes.widgetBody}>
        <div className={classes.widgetMain}>
          <div className={clsx(classes.mask, { isShow })} />
          <Select
            size="small"
            fullWidth
            open={isShow}
            className={classes.selectClasses}
            onOpen={() => setIsShow(true)}
            onClose={() => setIsShow(false)}
            value={currentClass}
            onChange={handleSelectClass}
            IconComponent={() => (
              <div className={classes.arrowDownBox} onClick={() => setIsShow(!isShow)}>
                <KeyboardArrowDown className={isShow ? classes.arrowDown : undefined} />
              </div>
            )}
          >
            {classList && classList.length > 0 && currentClass !== "no_class" ? (
              classList.map((item) => (
                <MenuItem
                  disabled={item?.class_id === currentClass}
                  className={classes.menuItem}
                  key={item?.class_id}
                  value={item?.class_id}
                >
                  <span>{item?.class_name}</span>
                  {item?.schools && item?.schools.length > 0 && <span>{item.schools[0]?.school_name}</span>}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="no_class" disabled>
                No Class
              </MenuItem>
            )}
          </Select>
          <Grid className={classes.widgetInfo} container spacing={2}>
            <Grid item xs={4}>
              <span>{classWidget?.lesson_count ?? 0}</span>
              <span>Lessons to teacher today</span>
            </Grid>
            <Grid item xs={4}>
              <span>{classWidget?.study_count ?? 0}</span>
              <span>homework due today</span>
            </Grid>
            <Grid item xs={4}>
              <span>{classWidget?.assessment_count ?? 0}</span>
              <span>Assessments to finish this week</span>
            </Grid>
          </Grid>
          <Grid className={classes.widgetBtns} container spacing={2}>
            <Grid item xs={4}>
              <Button variant="contained" onClick={() => handleSkipPage("create")}>
                Create +
              </Button>
              <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("lesson")}>
                view schedule
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={() => handleSkipPage("assign")}>
                Assign +
              </Button>
              <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("homework")}>
                view schedule
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("assessment")}>
                view assesment
              </Button>
              <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("report")}>
                view report
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

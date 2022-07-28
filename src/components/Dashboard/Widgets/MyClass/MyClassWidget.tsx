import { WidgetType } from "@components/Dashboard/models/widget.model";
import { HomeScreenWidgetWrapper } from "@kl-engineering/kidsloop-px";
import { t } from "@locale/LocaleManager";
import { Button, Grid, SelectChangeEvent, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { RootState } from "@reducers/index";
import { getClassesByOrg, getClassWidget } from "@reducers/myclasseswidget";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import clsx from "clsx";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectClass from "./component/SelectClass";

interface IMyClassesWidgetProps {
  widgetContext?: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    widgetContent: {
      width: "100%",
      height: "100%",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    mask: {
      width: "calc(100% + 30px)",
      height: "calc(100% + 30px)",
      background: "rgba(3,3,3,.7)",
      position: "absolute",
      top: -15,
      left: -15,
      borderRadius: 10,
      display: "none",
      zIndex: 99,
      "&.isOpen": {
        display: "block",
      },
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

export default function MyClassWidget({ widgetContext }: IMyClassesWidgetProps) {
  const { classList, classWidget } = useSelector<RootState, RootState["myclasseswidget"]>((state) => state.myclasseswidget);
  const { editing = false, removeWidget, layouts, widgets } = widgetContext;
  const onRemove = () => removeWidget(WidgetType.MYCLASS, widgets, layouts);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentClass, setCurrentClass] = React.useState<string>("no_class");
  const host = window.location.origin;

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
    setLoading(true);
    const { payload } = (await dispatch(getClassesByOrg())) as unknown as PayloadAction<AsyncTrunkReturned<typeof getClassesByOrg>>;
    if (payload && payload.length > 0 && payload[0]?.class_id) {
      getClassCount(payload[0]?.class_id);
    }
    setLoading(false);
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
    let class_name = classList?.find((item) => item.class_id === currentClass)?.class_name ?? "";
    switch (type) {
      case "create": // create +
        routerParams = `schedule/edit?class_id=${currentClass}&class_name=${class_name}&class_type=OfflineClass`;
        break;
      case "lesson": // view schedule
        routerParams = `schedule?class_id=${currentClass}&class_name=${class_name}&class_type=OfflineClass,OnlineClass`;
        break;
      case "assign": // assign +
        routerParams = `schedule/edit?class_id=${currentClass}&class_name=${class_name}&class_type=Homework`;
        break;
      case "homework": // view schedule
        routerParams = `schedule?class_id=${currentClass}&class_name=${class_name}&class_type=Homework`;
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
    <HomeScreenWidgetWrapper
      loading={loading}
      error={false}
      errorScreen={<></>}
      noData={false}
      noDataScreen={<></>}
      label={t("widget_my_class_name")}
      editing={editing}
      onRemove={onRemove}
    >
      <div className={classes.widgetContent}>
        <div className={clsx(classes.mask, { isOpen })} />
        <SelectClass
          isOpen={isOpen}
          classList={classList}
          currentClass={currentClass}
          noClassLabel={t("widget_my_class_no_class")}
          onChange={handleSelectClass}
          onOpen={setIsOpen}
        />
        <Grid className={classes.widgetInfo} container spacing={2}>
          <Grid item xs={4}>
            <span>{classWidget?.lesson_count ?? 0}</span>
            <span>{t("widget_my_class_lesson_today_sum")}</span>
          </Grid>
          <Grid item xs={4}>
            <span>{classWidget?.study_count ?? 0}</span>
            <span>{t("widget_my_class_homework_due_today")}</span>
          </Grid>
          <Grid item xs={4}>
            <span>{classWidget?.assessment_count ?? 0}</span>
            <span>{t("widget_my_class_assessment_due_this_week")}</span>
          </Grid>
        </Grid>
        <Grid className={classes.widgetBtns} container spacing={2}>
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => handleSkipPage("create")}>
              {t("widget_my_class_create_lesson")}
            </Button>
            <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("lesson")}>
              {t("widget_my_class_view_lesson")}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" onClick={() => handleSkipPage("assign")}>
              {t("widget_my_class_assign_homework")}
            </Button>
            <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("homework")}>
              {t("widget_my_class_view_homework")}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("assessment")}>
              {t("widget_my_class_view_assessment")}
            </Button>
            <Button variant="contained" className={classes.widgeBtn} onClick={() => handleSkipPage("report")}>
              {t("widget_my_class_view_reports")}
            </Button>
          </Grid>
        </Grid>
      </div>
    </HomeScreenWidgetWrapper>
  );
}

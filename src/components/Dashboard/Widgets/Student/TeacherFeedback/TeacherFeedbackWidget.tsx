import { V2StudentAssessment, V2StudentAssessmentAttachment } from "@api/api.auto";
import { WidgetType } from "@components/Dashboard/models/widget.model";
import { dFetch, formatDate } from "@components/Dashboard/tools";
import WidgetWrapperError from "@components/Dashboard/WidgetManagement/WidgetWrapperError";
import WidgetWrapperNoData from "@components/Dashboard/WidgetManagement/WidgetWrapperNoData";
import { currentOrganizationState, useGlobalStateValue } from "@kl-engineering/frontend-state";
import { HomeScreenWidgetWrapper, UserAvatar } from "@kl-engineering/kidsloop-px";
import { Box, CircularProgress, Theme, Typography } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React, { useEffect, useMemo, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import {
  // FormattedDate,
  // FormattedMessage,
  useIntl,
} from "react-intl";
import { d } from "@locale/LocaleManager";
import NoDataMask from "@components/Dashboard/WidgetManagement/NoDataMask";

/** style **/
export interface StyleProps {
  totalCount: number;
}
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    widgetContent: {
      position: "relative",
      height: `100%`,
      display: `flex`,
      flexDirection: `column`,
      overflowY: `auto`,
      justifyContent: ({ totalCount }: any) => (totalCount === 0 ? `center` : `initial`),
    },
    feedbackOuterWrapper: {
      display: `flex`,
      flexDirection: `row`,
      flexGrow: 1,
      padding: theme.spacing(1.5),
    },
    feedbackInnerWrapper: {
      display: `flex`,
      flexDirection: `column`,
      flexGrow: 1,
    },
    feedbackHeader: {
      display: `flex`,
      flexDirection: `row`,
      alignItems: `center`,
      justifyContent: `space-between`,
    },
    noFeedBackPage: {
      display: `flex`,
      flexDirection: `column`,
      alignItems: `center`,
      justifyContent: `center`,
    },
    noFeedBack: {
      alignSelf: `center`,
      fontSize: 16,
      fontWeight: 600,
      marginTop: theme.spacing(1.5),
      color: theme.palette.info.main,
    },
    noFeedBackIcon: {
      width: 80,
    },
    iconWrapper: {
      [theme.breakpoints.down(`sm`)]: {
        display: `none`,
      },
    },
    name: {
      fontSize: 14,
    },
    date: {
      fontSize: 12,
      color: theme.palette.grey[600],
    },
    feedback: {
      backgroundColor: `#FFBC00`,
      borderRadius: `10px 20px 20px 20px`,
      opacity: `0.8`,
      fontSize: 14,
      padding: theme.spacing(2),
    },
    icon: {
      height: 60,
      width: 60,
      borderRadius: `50%`,
      display: `flex`,
    },
    avatar: {
      height: 50,
      width: 50,
    },
  })
);

/** map Assessment Schedule Server To Client Type **/
export type ScheduleClientType = `class` | `live` | `study` | `home_fun_study`;
export const mapAssessmentScheduleServerToClientType = (
  type?: `OfflineClass` | `OnlineClass` | `Homework` | `IsHomeFun`
): ScheduleClientType => {
  switch (type) {
    case `OfflineClass`:
      return `class`;
    case `OnlineClass`:
      return `live`;
    case `Homework`:
      return `study`;
    case `IsHomeFun`:
      return `home_fun_study`;
    default:
      return `class`;
  }
};

/** map Assessment For Student To Teacher Feedback Row **/
export interface TeacherFeedbackRow {
  id: string;
  title: string;
  type: string;
  score: number;
  teacherName: string;
  teacherAvatar: string;
  feedback: string;
  date: string;
  files: V2StudentAssessmentAttachment[];
}

// no data to display
const MockRows: TeacherFeedbackRow[] = [
  {
    id: "1",
    title: "Butterfly class",
    type: "",
    score: 10,
    teacherName: "Alex",
    teacherAvatar: "",
    feedback:
      "That’s a really great start, but perhaps you could play with your friends using English for 10 minutes. It will be good fun!",
    date: "14:21,Yesterday",
    files: [],
  },
  {
    id: "2",
    title: "Butterfly class",
    type: "",
    score: 10,
    teacherName: "Christina",
    teacherAvatar: "",
    feedback:
      "You had a great job! Repeat mant times as you review the learning outcome like vocabulary. Try reading more books also as a review!",
    date: "15:30,Jan 20",
    files: [],
  },
];

export const mapAssessmentForStudentToTeacherFeedbackRow = (item: V2StudentAssessment): TeacherFeedbackRow => {
  const lastTeacherComment = item.teacher_comments?.slice(-1)[0];
  const classTitle = item.title?.split(`-`)[0];
  const date = new Date((item.complete_at ?? 0) * 1000);
  const dateString = formatDate(date);
  return {
    id: item.id ?? "",
    feedback: lastTeacherComment?.comment ?? ``,
    files: item.student_attachments ?? [],
    score: item.score ?? 0,
    teacherName: lastTeacherComment ? `${lastTeacherComment?.teacher?.given_name}`?.trim() : ``,
    teacherAvatar: lastTeacherComment?.teacher?.avatar ?? "",
    title: classTitle ?? ``,
    date: dateString,
    type: mapAssessmentScheduleServerToClientType(item?.schedule?.type),
  };
};

/** Teacher Feedback Widget **/
interface TeacherFeedbackWidgetProps {
  widgetContext?: any;
}
const RowsPerPage = "3";
export default function TeacherFeedbackWidget({ widgetContext }: TeacherFeedbackWidgetProps) {
  const { editing = false, removeWidget, layouts, widgets } = widgetContext;
  const onRemove = () => removeWidget(WidgetType.TEACHERLOAD, widgets, layouts);

  const intl = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  // const [ subgroupBy, setSubgroupBy ] = useState(`home_fun_study`);
  const [rows, setRows] = useState<TeacherFeedbackRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const classes = useStyles({
    totalCount,
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const currentOrganization = useGlobalStateValue(currentOrganizationState);
  let organizationId: string = "";
  if (currentOrganization) {
    organizationId = currentOrganization.id ?? ``;
  }

  const fetchStatusGroups = async () => {
    if (rows.length === totalCount && totalCount !== 0) return;
    setLoading(true);
    try {
      const now = new Date();
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(now.getDate() - 14);
      let query = {
        org_id: organizationId,
        page: page.toString(),
        page_size: RowsPerPage.toString(),
        type: "home_fun_study",
        // order_by: `-complete_at`,
        order_by: `-completed_at`,
        complete_at_ge: Math.floor(fourteenDaysAgo.getTime() / 1000).toString(),
        complete_at_le: Math.floor(now.getTime() / 1000).toString(),
      };

      const resp = await dFetch("/assessments_for_student", query);
      // @ts-ignore
      const { list = [], total = 0 } = resp ?? {};
      setTotalCount(total);
      setRows([...rows, ...list.map(mapAssessmentForStudentToTeacherFeedbackRow)]);
      setPage(page + 1);
      setError(false);
    } catch (err) {
      setTotalCount(0);
      setRows([]);
      setError(true);
    }
    setLoading(false);
  };

  const showRows = useMemo(() => (rows.length > 0 ? rows : MockRows), [rows]);
  useEffect(() => {
    fetchStatusGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FEEDBACK_PAGINATION_DELAY = 1000;
  const scrollRef = useBottomScrollListener<HTMLDivElement>(fetchStatusGroups, {
    debounce: FEEDBACK_PAGINATION_DELAY,
  });

  return (
    <HomeScreenWidgetWrapper
      loading={!rows.length && loading}
      error={error}
      errorScreen={<WidgetWrapperError reload={fetchStatusGroups} />}
      noData={false}
      noDataScreen={<WidgetWrapperNoData />}
      label={intl.formatMessage({
        id: `home.student.teacherFeedbackWidget.containerTitleLabel`,
      })}
      editing={editing}
      onRemove={onRemove}
      // editing={false}
      // onRemove={()=>{}}
    >
      <div ref={scrollRef} className={classes.widgetContent}>
        {
          <>
            {showRows.map((item) => (
              <div key={item.id} className={classes.feedbackOuterWrapper}>
                <div className={classes.iconWrapper}>
                  <div className={classes.icon}>
                    <UserAvatar className={classes.avatar} name={item.teacherName ?? ``} src={item.teacherAvatar ?? ``} />
                  </div>
                </div>
                <div className={classes.feedbackInnerWrapper}>
                  <div className={classes.feedbackHeader}>
                    <Typography className={classes.name}>
                      <b>{item.teacherName}</b>, {item.title}
                    </Typography>
                    <Typography className={classes.date}>{item.date}</Typography>
                  </div>
                  <Typography className={classes.feedback}>{item.feedback}</Typography>
                </div>
              </div>
            ))}
            {loading && (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
            )}
          </>
        }
      </div>
      {rows.length === 0 && (
        <NoDataMask text={d("Monitor your attendance in within a two week period.").t("widget_student_teacher_feedback_no_data_tip")} />
      )}
    </HomeScreenWidgetWrapper>
  );
}

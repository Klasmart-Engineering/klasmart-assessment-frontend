import noFeedBack from "@assets/img/noFeedback.png";
import WidgetWrapper from "../../../WidgetWrapper";
// import { UserAvatar } from "@kl-engineering/kidsloop-px";
import UserAvatar from "./component/UserAvatar";
import { Box, CircularProgress, Theme, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import api from "@api/index";
import { V2StudentAssessment, V2StudentAssessmentAttachment } from "@api/api.auto";
import { WidgetType } from "@components/Dashboard/models/widget.model";
import {
  // FormattedDate,
  FormattedMessage,
  useIntl,
} from "react-intl";

/** style **/
export interface StyleProps {
  totalCount: number;
}
const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) =>
  createStyles({
    widgetContent: {
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
  date: Date;
  files: V2StudentAssessmentAttachment[];
}
export const mapAssessmentForStudentToTeacherFeedbackRow = (item: V2StudentAssessment): TeacherFeedbackRow => {
  const lastTeacherComment = item.teacher_comments?.slice(-1)[0];
  const classTitle = item.title?.split(`-`)[0];
  const date = new Date((item.complete_at ?? 0) * 1000);
  console.log("map assignment for student to teacher Feedback");
  return {
    id: item.id ?? "",
    feedback: lastTeacherComment?.comment ?? ``,
    files: item.student_attachments ?? [],
    score: item.score ?? 0,
    teacherName: lastTeacherComment ? `${lastTeacherComment?.teacher?.given_name}`?.trim() : ``,
    teacherAvatar: lastTeacherComment?.teacher?.avatar ?? "",
    title: classTitle ?? ``,
    date: date,
    type: mapAssessmentScheduleServerToClientType(item?.schedule?.type),
  };
};

/** Teacher Feedback Widget **/
interface TeacherFeedbackWidgetProps {
  RowsPerPage?: string;
}
export default function TeacherFeedbackWidget({ RowsPerPage = `3` }: TeacherFeedbackWidgetProps) {
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

  const fetchStatusGroups = async () => {
    console.log("Fetching status groups:");
    console.log("api:", api.assessmentsForStudent);
    if (rows.length === totalCount && totalCount !== 0) return;
    setLoading(true);
    try {
      const now = new Date();
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(now.getDate() - 14);
      const resp = await api.assessmentsForStudent.getStudentAssessments({
        // org_id: currentOrganization?.id ?? ``,
        page: page.toString(),
        page_size: RowsPerPage,
        type: "home_fun_study",
        // order_by: `-complete_at`,
        order_by: `-completed_at`,
        complete_at_ge: Math.floor(fourteenDaysAgo.getTime() / 1000).toString(),
        complete_at_le: Math.floor(now.getTime() / 1000).toString(),
      });
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

  useEffect(() => {
    fetchStatusGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FEEDBACK_PAGINATION_DELAY = 1000;
  const scrollRef = useBottomScrollListener<HTMLDivElement>(fetchStatusGroups, {
    debounce: FEEDBACK_PAGINATION_DELAY,
  });

  return (
    <WidgetWrapper
      loading={!rows.length && loading}
      error={error}
      noData={false}
      reload={fetchStatusGroups}
      label={intl.formatMessage({
        id: `home.student.teacherFeedbackWidget.containerTitleLabel`,
      })}
      /*link={{
                    url: ``,
                    label: intl.formatMessage({
                        id: `home.student.teacherFeedbackWidget.containerUrlLabel`,
                    }),
                }}*/
      id={WidgetType.TEACHERLOAD}
    >
      <div ref={scrollRef} className={classes.widgetContent}>
        {rows && rows.length !== 0 ? (
          <>
            {rows.map((item) => (
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
                    {/* <Typography className={classes.date}>{formatDate(item.date)}</Typography> */}
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
        ) : (
          <Box className={classes.noFeedBackPage}>
            <img src={noFeedBack} className={classes.noFeedBackIcon} alt="no feedback" />
            <Typography gutterBottom variant="body2" className={classes.noFeedBack}>
              {/*{d("There is no teacher's feedback").t("home_student_teacherFeedbackWidget_noFeedBack")}*/}
              <FormattedMessage id={`home.student.teacherFeedbackWidget.noFeedBack`} />
            </Typography>
          </Box>
        )}
      </div>
    </WidgetWrapper>
  );
}

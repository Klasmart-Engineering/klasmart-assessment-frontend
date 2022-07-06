import { enableReviewClass } from "@api/extra";
import { AssessmentTypeValues } from "@components/AssessmentType";
import MutipleCheckboxDropdown from "@components/MutipleCheckboxDropdown";
import { createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { formattedDate, formattedTime } from "@models/ModelOutcomeDetailForm";
import clsx from "clsx";
import React, { useMemo } from "react";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { AssessmentListResult, AssessmentQueryCondition, AssessmentStatus } from "./types";

const useStyles = makeStyles((theme) =>
  createStyles({
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
      marginTop: 30,
    },
    tableRow: {
      background: "rgb(242, 245, 247)",
    },
    tableCell: {
      minWidth: 104,
      maxWidth: 200,
      textAlign: "center",
      wordWrap: "break-word",
      boxSizing: "border-box",
    },
    headCell: {
      fontSize: "16px",
      fontWeight: 600,
      textAlign: "center",
    },
    nameListCell: {
      maxWidth: 300,
    },
    statusCell: {
      width: 115,
      minWidth: 104,
      maxWidth: 115,
    },
    statusCon: {
      color: "#fff",
      borderRadius: "15px",
      height: 26,
      lineHeight: "26px",
      textAlign: "center",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      padding: "0 5px",
    },
    completeColor: {
      backgroundColor: "#1aa21e",
    },
    inCompleteColor: {
      backgroundColor: "#f1c621",
    },
  })
);

interface AssessmentProps {
  assessment: AssessmentListResult[0];
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
  // assessmentType: AssessmentQueryCondition["assessment_type"];
}
function AssessmentRow(props: AssessmentProps) {
  const css = useStyles();
  const { assessment, onClickAssessment } = props;
  const isComplete = assessment.status === AssessmentStatus.complete;
  const statusText = isComplete
    ? d("Complete").t("assess_filter_complete")
    : assessment.status === AssessmentStatus.pending
    ? d("Pending").t("assess_label_pending")
    : assessment.status === AssessmentStatus.notstarted
    ? d("NotStarted").t("assessment_status_not_started")
    : assessment.status === AssessmentStatus.started
    ? d("Started").t("assessment_status_started")
    : assessment.status === AssessmentStatus.draft
    ? d("Draft").t("assess_label_draft")
    : "-";
  const isLong = useMemo(() => {
    if (statusText.length > 16) {
      return true;
    } else {
      return false;
    }
  }, [statusText.length]);
  const statusCom = <div className={clsx(css.statusCon, isComplete ? css.completeColor : css.inCompleteColor)}>{statusText}</div>;
  const assessmentTypeMap = (type?: string) => {
    if (type === AssessmentTypeValues.class) {
      return d("Class").t("schedule_detail_offline_class");
    } else if (type === AssessmentTypeValues.live) {
      return d("Live").t("schedule_detail_online_class");
    } else if (type === AssessmentTypeValues.study) {
      return d("Study").t("assess_study_list_study");
    } else if (type === AssessmentTypeValues.homeFun) {
      return d("Study / Home Fun").t("assess_class_type_homefun");
    } else if (type === AssessmentTypeValues.review) {
      return d("Study / Auto Review").t("assessment_list_study_review");
    }
  };
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id, assessment.assessment_type)}>
      <TableCell className={css.tableCell} align="center">
        {assessmentTypeMap(assessment.assessment_type)}
      </TableCell>
      <TableCell className={css.tableCell} align="center">
        {assessment.title ?? `-`}
      </TableCell>
      <TableCell align="center">{assessment.lesson_plan?.name ?? `-`}</TableCell>
      <TableCell align="center">{assessment.program?.name ?? `-`}</TableCell>
      <TableCell align="center">
        {assessment.subjects && assessment.subjects.length ? assessment.subjects?.map((v) => v.name).join(", ") : `-`}
      </TableCell>
      <TableCell align="center" className={css.statusCell}>
        {isLong ? (
          <Tooltip title={statusText} placement="top">
            {statusCom}
          </Tooltip>
        ) : (
          statusCom
        )}
      </TableCell>
      <TableCell align="center" className={css.nameListCell}>
        {assessment.teachers?.map((v) => v.name)?.join(" ,") ?? `-`}
      </TableCell>
      <TableCell align="center">{assessment.class_end_at ? formattedTime(assessment.class_end_at) : `-`}</TableCell>
      <TableCell align="center">{assessment.due_at ? formattedDate(assessment.due_at) : `-`}</TableCell>
      <TableCell align="center">{assessment.complete_at ? formattedTime(assessment.complete_at) : `-`}</TableCell>
      <TableCell align="center">{assessment.class_info?.name ?? `-`}</TableCell>
      <TableCell align="center">{assessment?.complete_rate ? `${Math.round(assessment?.complete_rate * 100)}%` : `-`}</TableCell>
    </TableRow>
  );
}

export interface Options {
  label: string;
  value: string;
}
export const assessmentTypeOptions = () => {
  if (enableReviewClass) {
    return [
      { label: d("Class").t("schedule_detail_offline_class"), value: AssessmentTypeValues.class },
      { label: d("Live").t("schedule_detail_online_class"), value: AssessmentTypeValues.live },
      { label: d("Study").t("assess_study_list_study"), value: AssessmentTypeValues.study },
      { label: d("Study / Home Fun").t("assess_class_type_homefun"), value: AssessmentTypeValues.homeFun },
      { label: d("Study / Auto Review").t("assessment_list_study_review"), value: AssessmentTypeValues.review },
    ];
  } else {
    return [
      { label: d("Class").t("schedule_detail_offline_class"), value: AssessmentTypeValues.class },
      { label: d("Live").t("schedule_detail_online_class"), value: AssessmentTypeValues.live },
      { label: d("Study").t("assess_study_list_study"), value: AssessmentTypeValues.study },
      { label: d("Study / Home Fun").t("assess_class_type_homefun"), value: AssessmentTypeValues.homeFun },
    ];
  }
};
const statusOptions = () => {
  const options = [
    { label: d("Pending").t("assess_label_pending"), value: AssessmentStatus.pending },
    { label: d("NotStarted").t("assessment_status_not_started"), value: AssessmentStatus.notstarted },
    { label: d("Started").t("assessment_status_started"), value: AssessmentStatus.started },
    { label: d("Draft").t("assess_label_draft"), value: AssessmentStatus.draft },
    { label: d("Complete").t("assess_filter_complete"), value: AssessmentStatus.complete },
  ];
  return options;
};
export interface AssessmentTableProps {
  total: number;
  list: AssessmentListResult;
  queryCondition: AssessmentQueryCondition;
  assessmentTypes: string[];
  assessmentStatus: string[];
  onChangePage: (page: number) => void;
  onClickAssessment: (id: string | undefined, assessment_type: string | undefined) => any;
  onChangeAssessmentType: (event: React.MouseEvent<HTMLLIElement>, value: string) => void;
  onChangeStatus: (event: React.MouseEvent<HTMLLIElement>, value: string) => void;
  onFilter: () => void;
}
export function AssessmentTable(props: AssessmentTableProps) {
  const css = useStyles();
  const {
    queryCondition: { page },
    total,
    list,
    assessmentTypes,
    assessmentStatus,
    onChangePage,
    onClickAssessment,
    onChangeAssessmentType,
    onChangeStatus,
    onFilter,
  } = props;
  const amountPerPage = 20;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  const handleChangeAssessmentType = (event: React.MouseEvent<HTMLLIElement>, value: string) => {
    onChangeAssessmentType(event, value);
  };
  const handleChangeStatus = (event: React.MouseEvent<HTMLLIElement>, value: string) => {
    onChangeStatus(event, value);
  };
  return (
    <LayoutBox holderMin={40} holderBase={80} mainBase={1760}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className={css.tableRow}>
              <TableCell className={css.headCell}>
                <MutipleCheckboxDropdown
                  options={assessmentTypeOptions()}
                  checked={assessmentTypes}
                  label={d("Class Type").t("assess_class_type")}
                  onSelectOneOption={handleChangeAssessmentType}
                  onFilter={onFilter}
                />
              </TableCell>
              <TableCell className={css.headCell}>{d("Assessment Title").t("assess_column_title")}</TableCell>
              <TableCell className={css.headCell}>{d("Lesson Plan").t("library_label_lesson_plan")}</TableCell>
              <TableCell className={css.headCell}>{d("Program").t("assess_column_program")}</TableCell>
              <TableCell className={css.headCell}>{d("Subject").t("assess_column_subject")}</TableCell>
              <TableCell className={css.headCell}>
                <MutipleCheckboxDropdown
                  options={statusOptions()}
                  checked={assessmentStatus}
                  label={d("Status").t("assess_filter_column_status")}
                  onSelectOneOption={handleChangeStatus}
                  onFilter={onFilter}
                />
              </TableCell>
              <TableCell className={css.headCell}>{d("Teacher").t("assess_column_teacher")}</TableCell>
              <TableCell className={css.headCell}>{d("Class End Time").t("assess_column_class_end_time")}</TableCell>
              <TableCell className={css.headCell}>{d("Due Date").t("assess_column_due_date")}</TableCell>
              <TableCell className={css.headCell}>{d("Complete Time").t("assess_column_complete_time")}</TableCell>
              <TableCell className={css.headCell}>{d("Class Name").t("assess_detail_class_name")}</TableCell>
              <TableCell className={css.headCell}>{d("Completion Rate").t("assess_list_completion_rate")}</TableCell>
            </TableRow>
          </TableHead>
          {/* <PLTableHeader fields={header} style={{ height: 80, width: "100%" }} /> */}
          <TableBody>
            {list.map((item) => (
              <AssessmentRow key={item.id} assessment={item} onClickAssessment={onClickAssessment} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {list.length > 0 && (
        <Pagination
          page={page}
          className={css.pagination}
          classes={{ ul: css.paginationUl }}
          onChange={handleChangePage}
          count={Math.ceil(total / amountPerPage)}
          color="primary"
        />
      )}
    </LayoutBox>
  );
}

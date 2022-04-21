import { Divider, Grid, Menu, MenuItem, SvgIcon, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import FilterListOutlinedIcon from "@material-ui/icons/FilterListOutlined";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import produce from "immer";
import React, { ChangeEvent } from "react";
// import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, StudyAssessmentOrderBy } from "../../api/type";
import { ReactComponent as StatusIcon } from "../../assets/icons/assessments-status.svg";
import { assessmentTypes, AssessmentTypeValues } from "../../components/AssessmentType";
import LayoutBox from "../../components/LayoutBox";
import { useRole } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";
import { StudyAssessmentQueryConditionBaseProps } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20 + 10,
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
  bulkActionSelect: {
    width: 160,
    height: 40,
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    display: "none",
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

const sortOptions = () => [
  { label: d("Created On (New-Old)").t("assess_label_created_on_newtoold"), value: StudyAssessmentOrderBy._create_at },
  { label: d("Created On (Old-New)").t("assess_label_created_on_oldtonew"), value: StudyAssessmentOrderBy.create_at },
  { label: d("Complete Time (New-Old)").t("assess_complete_time_new_old"), value: StudyAssessmentOrderBy._complete_at },
  { label: d("Complete Time (Old-New)").t("assess_complete_time_old_new"), value: StudyAssessmentOrderBy.complete_at },
];
const assessmentStatusOptions = () => [
  { label: d("All").t("assess_filter_all"), value: AssessmentStatus.all },
  { label: d("Complete").t("assess_filter_complete"), value: AssessmentStatus.complete },
  { label: d("Incomplete").t("assess_filter_in_progress"), value: AssessmentStatus.in_progress },
];
export interface ThirdSearchHeaderProps extends StudyAssessmentQueryConditionBaseProps {
  onChangeAssessmentType?: (assessmentType: AssessmentTypeValues) => any;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange } = props;
  const { completed_perm, in_progress_perm } = useRole();

  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as StudyAssessmentOrderBy | undefined;
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleChangeStatus = (event: ChangeEvent<HTMLInputElement>) => {
    const status = event.target.value as AssessmentStatus | undefined;
    const newValue = produce(value, (draft) => {
      status ? (draft.status = status) : delete draft.status;
    });
    onChange({ ...newValue, page: 1 });
  };
  const orderbyOptions = sortOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  const statusOptions = assessmentStatusOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["xs", "sm"]}>
          <Divider />
          <Grid container spacing={3} alignItems="center" style={{ marginTop: "6px" }}>
            <Grid item sm={6} xs={6} md={3}>
              {(completed_perm.view_completed_assessments_414 ||
                completed_perm.view_org_completed_assessments_424 ||
                completed_perm.view_school_in_progress_assessments_427) &&
                (in_progress_perm.view_in_progress_assessments_415 ||
                  in_progress_perm.view_org_in_progress_assessments_425 ||
                  in_progress_perm.view_school_in_progress_assessments_427) && (
                  <TextField
                    size="small"
                    style={{ width: 200 }}
                    onChange={handleChangeStatus}
                    value={value.status || AssessmentStatus.all}
                    label={d("Status").t("assess_filter_column_status")}
                    select
                    SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
                  >
                    {statusOptions}
                  </TextField>
                )}
            </Grid>
            <Hidden only={["xs", "sm"]}>
              <Grid item md={6}></Grid>
            </Hidden>
            <Grid container direction="row" justify="flex-end" alignItems="center" item sm={6} xs={6} md={3}>
              <TextField
                size="small"
                style={{ width: 200 }}
                onChange={handleChangeOrder}
                value={value.order_by || StudyAssessmentOrderBy._complete_at}
                label={d("Sort By").t("assess_sort_by")}
                select
                SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
              >
                {orderbyOptions}
              </TextField>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

export function ThirdSearchHeaderMb(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const { value, onChange, onChangeAssessmentType } = props;
  const [anchorStatusEl, setAnchorStatusEl] = React.useState<null | HTMLElement>(null);
  const [anchorSortEl, setAnchorSortEl] = React.useState<null | HTMLElement>(null);
  const [anchorTypeEl, setAnchorTypeEl] = React.useState<null | HTMLElement>(null);
  const showStatus = (event: any) => {
    setAnchorStatusEl(event.currentTarget);
  };
  const showSort = (event: any) => {
    setAnchorSortEl(event.currentTarget);
  };
  const handleClickStatusbyItem = (event: any, status: AssessmentStatus | undefined) => {
    setAnchorStatusEl(null);
    const newValue = produce(value, (draft) => {
      status ? (draft.status = status) : delete draft.status;
    });
    onChange({ ...newValue, page: 1 });
  };
  const handleClickOrderbyItem = (event: any, order_by: StudyAssessmentOrderBy | undefined) => {
    setAnchorSortEl(null);
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleStatusClose = () => {
    setAnchorStatusEl(null);
  };
  const handleSortClose = () => {
    setAnchorSortEl(null);
  };
  const showTypes = (event: any) => {
    setAnchorTypeEl(event.currentTarget);
  };
  const handleClickTypebyItem = (event: any, assessmentType: AssessmentTypeValues) => {
    setAnchorSortEl(null);
    if (onChangeAssessmentType) {
      onChangeAssessmentType(assessmentType);
    }
  };
  const handleTypeClose = () => {
    setAnchorTypeEl(null);
  };
  return (
    <div className={classes.root}>
      <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
        <Hidden only={["md", "lg", "xl"]}>
          <Divider />
          <Grid container alignItems="center" style={{ marginTop: "6px", position: "relative" }}>
            <Grid item sm={10} xs={10}></Grid>
            <Grid container justify="flex-end" alignItems="center" item sm={2} xs={2}>
              <FilterListOutlinedIcon onClick={showTypes} />
              <Menu anchorEl={anchorTypeEl} keepMounted open={Boolean(anchorTypeEl)} onClose={handleTypeClose}>
                {assessmentTypes().map((item, index) => (
                  <MenuItem
                    key={item.label}
                    selected={item.value === AssessmentTypeValues.study}
                    onClick={(e) => handleClickTypebyItem(e, item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <SvgIcon component={StatusIcon} onClick={showStatus} />
              <Menu anchorEl={anchorStatusEl} keepMounted open={Boolean(anchorStatusEl)} onClose={handleStatusClose}>
                {assessmentStatusOptions().map((item, index) => (
                  <MenuItem key={item.label} selected={value.status === item.value} onClick={(e) => handleClickStatusbyItem(e, item.value)}>
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
              <ImportExportIcon onClick={showSort} />
              <Menu anchorEl={anchorSortEl} keepMounted open={Boolean(anchorSortEl)} onClose={handleSortClose}>
                {sortOptions().map((item, index) => (
                  <MenuItem
                    key={item.label}
                    selected={value.order_by === item.value}
                    onClick={(e) => handleClickOrderbyItem(e, item.value)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Hidden>
      </LayoutBox>
    </div>
  );
}

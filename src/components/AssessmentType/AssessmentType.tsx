import { enableReviewClass } from "@api/extra";
import { MenuItem, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import { d } from "../../locale/LocaleManager";
export enum AssessmentTypeValues {
  class = "OfflineClass",
  live = "OnlineClass",
  homeFun = "OfflineStudy",
  study = "OnlineStudy",
  review = "ReviewStudy",
}
export interface options {
  label?: string;
  value?: string;
}
export const assessmentTypes = () => {
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
const menuItemList = (list: options[]) =>
  list.map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
export interface AssessmentTypeProps {
  type: AssessmentTypeValues;
  onChangeAssessmentType: (assessmentType: AssessmentTypeValues) => any;
}
export function AssessmentType(props: AssessmentTypeProps) {
  const { type, onChangeAssessmentType } = props;
  const handleChangeAssessmentType = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeAssessmentType(event.target.value as AssessmentTypeValues);
  };
  return (
    <TextField
      style={{ width: 160, marginLeft: 10 }}
      size="small"
      onChange={handleChangeAssessmentType}
      label={d("Class Type").t("assess_class_type")}
      value={type}
      select
      SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
    >
      {menuItemList(assessmentTypes())}
    </TextField>
  );
}

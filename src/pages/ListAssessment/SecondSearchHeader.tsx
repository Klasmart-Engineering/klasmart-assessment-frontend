import { Grid, MenuItem, TextField } from "@mui/material";
import produce from "immer";
import React, { ChangeEvent } from "react";
import { UseFormMethods } from "react-hook-form";
import { ExectSeachType, OrderByAssessmentList } from "../../api/type";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { ListSearch, SearchComProps } from "./ListSearch";
import { AssessmentQueryCondition, AssessmentQueryConditionBaseProps, SearchListForm, UserEntity } from "./types";
const searchFieldList = () => {
  return [
    { label: d("All").t("assess_search_all"), value: ExectSeachType.all },
    // { label: "Class Name", value: ExectSeachType.class_name },
    { label: d("Teacher Name").t("schedule_label_teacher_name"), value: ExectSeachType.teacher_name },
  ];
};
const sortOptions = () => {
  const options = [
    { label: d("Created On (New-Old)").t("assess_label_created_on_newtoold"), value: OrderByAssessmentList._create_at },
    { label: d("Created On (Old-New)").t("assess_label_created_on_oldtonew"), value: OrderByAssessmentList.create_at },
  ];
  return options;
};
export interface SecondSearchHeaderProps extends AssessmentQueryConditionBaseProps {
  formMethods: UseFormMethods<SearchListForm>;
  onSearchTeacherName: (name: string) => void;
  teacherList?: UserEntity[];
}
export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const { value, formMethods, teacherList, onChange, onSearchTeacherName } = props;
  const handleClickSearch = (searchField: SearchComProps["searchFieldDefaultValue"], searchInfo: UserEntity) => {
    const teacher_name = searchInfo.name;
    const query_key = searchInfo.id;
    const query_type = query_key ? (searchField as AssessmentQueryCondition["query_type"]) : undefined;
    onChange({ ...value, query_key, query_type, teacher_name, page: 1 });
  };

  const handleChangeOrder = (order_by: string) => {
    const _order_by = order_by as OrderByAssessmentList;
    const newValue = produce(value, (draft) => {
      _order_by ? (draft.order_by = _order_by) : delete draft.order_by;
    });
    onChange({ ...newValue, page: 1 });
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <LayoutBox holderMin={40} holderBase={80} mainBase={1760}>
        <Grid container spacing={3} style={{ marginTop: "6px" }}>
          <Grid item md={12} lg={12} xl={12}>
            <ListSearch
              searchTextDefaultValue={value.query_key ?? ""}
              searchFieldDefaultValue={ExectSeachType.teacher_name}
              defaultTeacherName={value.teacher_name ?? ""}
              searchFieldList={searchFieldList()}
              onSearch={handleClickSearch}
              formMethods={formMethods}
              onSearchTeacherName={onSearchTeacherName}
              usersList={teacherList}
            />
            <DropdownList
              label={d("Sort By").t("assess_label_sort_by")}
              value={value.order_by as OrderByAssessmentList}
              list={sortOptions()}
              onChange={handleChangeOrder}
            />
          </Grid>
        </Grid>
      </LayoutBox>
    </div>
  );
}

export interface options {
  label?: string;
  value?: string;
}
export type DropdownListProps = {
  label?: string;
  value: string;
  list: options[];
  style?: Record<string, any>;
  onChange: (value: DropdownListProps["value"]) => void;
};
export function DropdownList(props: DropdownListProps) {
  const { label, value, list, style, onChange } = props;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <TextField
      style={{ ...style }}
      label={label}
      value={value}
      onChange={handleChange}
      size="small"
      select
      SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
    >
      {list.map((item) => (
        <MenuItem key={item.label} value={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

import { AssessmentTypeValues } from "@components/AssessmentType";
import { Autocomplete, MenuItem, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { ChangeEvent, useState } from "react";
import { d } from "../../locale/LocaleManager";
import { MainDimensionOptions, SubDimensionOptions } from "./type";
const useStyles = makeStyles((theme: Theme) => ({
  lps_title: {
    fontWeight: "bolder",
    marginBottom: 10,
    martinTop: 10,
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));
export enum Dimension {
  student = "student",
  material = "material",
  all = "all",
  submitted = "submitted",
  notSubmitted = "notSubmitted",
}
export interface MultiSelectProps {
  assessment_type: AssessmentTypeValues;
  dimension: Dimension;
  mainDimension: MainDimensionOptions[];
  subDimension: SubDimensionOptions[];
  onChangeDimension: (value: Dimension) => void;
  onChangeSubdimension: (value: SubDimensionOptions[]) => void;
}
export function MultiSelect(props: MultiSelectProps) {
  const { assessment_type, dimension, mainDimension, subDimension, onChangeDimension, onChangeSubdimension } = props;
  const initOption = [{ id: "all", name: d("Select All").t("schedule_detail_select_all") }];
  const isReview = assessment_type === AssessmentTypeValues.review;
  const [subValue, setSubValue] = useState(initOption);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeDimension(e.target.value as Dimension);
    setSubValue(initOption);
  };
  const handleChangeAutoComplete = (e: ChangeEvent<{}>, value: SubDimensionOptions[], reason: string) => {
    if (value.length === 0 && reason === "remove-option") {
      value.push(initOption[0]);
    }
    const element = e.target as Element;
    const oIdx = element.getAttribute("data-option-index");
    if (oIdx === "0") {
      if (value.length) {
        value.splice(0, value.length);
      }
      value.push(initOption[0]);
    } else {
      if (reason === "select-option") {
        value.forEach((item, index) => {
          if (item.id === "all") {
            value.splice(index, 1);
          }
        });
      } else if (reason === "remove-option") {
        if (!value.length) {
          value.push(subDimension[Number(oIdx) - 1]);
        }
      }
    }
    setSubValue(value);
    onChangeSubdimension(value);
  };
  return (
    <>
      <div style={{ display: "flex", marginBottom: 24 }}>
        {!isReview && (
          <TextField
            style={{ width: 266, marginRight: 10 }}
            value={dimension}
            onChange={handleChange}
            size="medium"
            select
            SelectProps={{ MenuProps: { transformOrigin: { vertical: -40, horizontal: "left" } } }}
          >
            {mainDimension.map((item) => (
              <MenuItem key={item.label} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Autocomplete
          style={{ width: 266 }}
          multiple
          disableClearable={true}
          limitTags={1}
          id="tags-outlined"
          options={[...initOption, ...subDimension]}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option: SubDimensionOptions, value: SubDimensionOptions) => option.id === value.id}
          // getOptionSelected={(option: SubDimensionOptions, value: SubDimensionOptions) => option.id === value.id}
          value={subValue}
          onChange={(e, value, reasopn) => handleChangeAutoComplete(e, value, reasopn)}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label={d("Please select here").t("assess_detail_please_select_here")} />
          )}
        />
      </div>
    </>
  );
}

export interface SubTitleProps {
  text: string;
}
export function Subtitle(props: SubTitleProps) {
  const { text } = props;
  const css = useStyles();
  const { breakpoints } = useTheme();
  const xs = useMediaQuery(breakpoints.down("xs"));
  const radioTypography = xs ? "subtitle2" : "h6";
  return (
    <Typography variant={radioTypography} className={css.lps_title}>
      {text}
    </Typography>
  );
}

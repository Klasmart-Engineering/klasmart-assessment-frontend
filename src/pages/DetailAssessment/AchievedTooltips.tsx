import { InfoOutlined } from "@mui/icons-material";
import { Checkbox, FormControlLabel, Theme, Tooltip } from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import React from "react";
import { d } from "../../locale/LocaleManager";

interface AchievedTooltipsProps {
  showPartially?: boolean;
}

const useStyles = makeStyles({
  tooltip: {
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    "& .assessment-MuiFormControlLabel-root": {
      marginRight: 0,
      "& .assessment-MuiCheckbox-root": {
        padding: "5px 9px",
      },
    },
    "& .assessment-MuiTypography-root": {
      fontSize: 14,
    },
  },
  partially_checked: {
    width: 15,
    height: 15,
    margin: 2.4,
    borderRadius: 3,
    backgroundColor: "#0E78D5",
    boxShadow: "0 0 2px #0E78D5",
  },
});

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    margin: "10px 0",
    padding: "6px 18px",
  },
}))(Tooltip);

//todo 待翻译
export function AchievedTooltips(props: AchievedTooltipsProps = { showPartially: false }) {
  const { showPartially } = props;
  const classes = useStyles();
  return (
    <LightTooltip
      placement="top"
      title={
        <div className={classes.tooltip}>
          <FormControlLabel
            label={d("All Achieved").t("assess_option_all_achieved")}
            control={<Checkbox name="checked" color="primary" size="small" readOnly checked />}
          />
          {showPartially && (
            <FormControlLabel
              label={d("Partially Achieved").t("assessment_partially_achieved")}
              control={
                <Checkbox
                  name="checkedP"
                  color="primary"
                  size="small"
                  indeterminateIcon={<div className={classes.partially_checked} />}
                  readOnly
                  indeterminate
                  defaultChecked
                />
              }
            />
          )}
          <FormControlLabel
            label={d("Not Achieved").t("report_label_not_achieved")}
            control={<Checkbox name="unchecked" color="primary" size="small" readOnly />}
          />
        </div>
      }
    >
      <InfoOutlined style={{ marginLeft: "10px", color: "gray", cursor: "pointer" }} />
    </LightTooltip>
  );
}

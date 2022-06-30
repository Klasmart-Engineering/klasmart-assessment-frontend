import { enableReviewClass } from "@api/extra";
import { d } from "@locale/LocaleManager";
import { Box, Button, Checkbox, createStyles, makeStyles, MenuItem, MenuList, Popover, Theme, Typography } from "@material-ui/core";
import { ArrowDropDown } from "@material-ui/icons";
import React, { useState } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuButton: {
      minWidth: 24,
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
  })
);

export enum AssessmentTypeValues {
  class = "OfflineClass",
  live = "OnlineClass",
  homeFun = "OfflineStudy",
  study = "OnlineStudy",
  review = "ReviewStudy",
}
export interface Options {
  label: string;
  value: string;
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

interface Props {
  options: Options[];
  checked: string[];
  label: string;
  onSelectOneOption: (event: React.MouseEvent<HTMLLIElement>, value: string) => void;
  onFilter: () => void;
}

export default function MutipleCheckboxDropdown(props: Props) {
  const { options, checked, label, onSelectOneOption, onFilter } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onFilter();
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
      <Typography style={{ fontSize: "16px", fontWeight: 600 }}>{label}</Typography>
      <Button className={classes.menuButton} onClick={handleClick}>
        <ArrowDropDown color="action" />
      </Button>
      <Popover
        keepMounted
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: `bottom`,
          horizontal: `right`,
        }}
        transformOrigin={{
          vertical: `top`,
          horizontal: `right`,
        }}
        onClose={handleClose}
      >
        <MenuList>
          {options.map((action, i) => (
            <MenuItem
              key={`menu-item-${i}`}
              onClick={(e) => {
                onSelectOneOption(e, action.value);
                // handleClose();
              }}
            >
              <Checkbox
                checked={checked.indexOf(action.value) >= 0}
                // indeterminate={indeterminate}
                inputProps={{
                  "aria-label": `select all on page`,
                }}
              />
              <Typography variant="body2">{action.label}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </Box>
  );
}

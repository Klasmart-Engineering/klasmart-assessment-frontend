import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Theme } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import React, { useMemo, useState } from "react";
import { ApiPullOutcomeSetResponse } from "../../api/api.auto";
import { OutcomeSetResult } from "../../api/type";
import { LButton, LButtonProps } from "../../components/LButton";
import { OutcomeSet } from "../../components/OutSet";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    okBtn: {
      marginLeft: "40px !important",
    },
    dialogContent: {
      height: 350,
      boxSizing: "border-box",
      borderBottom: "none",
    },
    title: {
      "& .assessment-MuiTypography-root": {
        fontSize: "24px !important",
        fontWeight: 700,
      },
    },
  })
);
export interface AddSetProps {
  open: boolean;
  onClose: () => any;
  onAddSet: () => ReturnType<LButtonProps["onClick"]>;
  showSetList: boolean;
  onSearchOutcomeSet: (set_name: string) => any;
  onCreateOutcomeSet: (set_name: string) => any;
  onSetOutcomeSet: (ids: string[]) => any;
  selectedOutcomeSet: OutcomeSetResult;
  outcomeSetList: ApiPullOutcomeSetResponse["sets"];
  onDeleteSet: (set_id: string) => any;
  defaultSelectOutcomeset: string;
  onInputChange: () => any;
}
export function AddSet(props: AddSetProps) {
  const css = useStyles();
  const {
    open,
    onClose,
    onAddSet,
    showSetList,
    onSearchOutcomeSet,
    onCreateOutcomeSet,
    onSetOutcomeSet,
    selectedOutcomeSet,
    outcomeSetList,
    onDeleteSet,
    defaultSelectOutcomeset,
    onInputChange,
  } = props;
  const handleDelete = (set_id: string) => {
    onDeleteSet(set_id);
  };
  return (
    <Dialog maxWidth={"sm"} fullWidth={true} open={open}>
      <DialogTitle className={css.title}>{d("Add to Set").t("assess_set_add_to_set")}</DialogTitle>
      <DialogContent className={css.dialogContent} dividers>
        <OutcomeSet
          title={d("Select or create a new one").t("assess_set_select_create")}
          showChipList={true}
          showSetList={showSetList}
          onSearchOutcomeSet={onSearchOutcomeSet}
          onCreateOutcomeSet={onCreateOutcomeSet}
          onSetOutcomeSet={(ids) => onSetOutcomeSet(ids)}
          selectedOutcomeSet={selectedOutcomeSet}
          outcomeSetList={outcomeSetList}
          onDeleteSet={handleDelete}
          defaultSelectOutcomeset={defaultSelectOutcomeset}
          onInputChange={onInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disableRipple={true} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <LButton color="primary" variant="contained" className={css.okBtn} onClick={onAddSet}>
          {d("CONFIRM").t("general_button_CONFIRM")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}

export function useAddSet() {
  const [active, setActive] = useState(false);
  const [addSetShowIndex, setAddSetShowIndex] = useState(0);
  return useMemo(
    () => ({
      addSetShowIndex,
      addSetActive: active,
      openAddSet: () => {
        setAddSetShowIndex(addSetShowIndex + 1);
        setActive(true);
      },
      closeAddSet: () => {
        setActive(false);
      },
    }),
    [active, addSetShowIndex]
  );
}

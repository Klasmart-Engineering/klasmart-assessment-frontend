import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
const useStyles = makeStyles((theme: Theme) => ({
  dialogContainer: {
    "& .assessment-MuiPaper-root": {
      padding: "30px 40px 20px 40px",
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        padding: "20px 0px 20px 10px",
      },
      [theme.breakpoints.down(600)]: {
        padding: "0px",
      },
    },
  },
  dialogContainer1: {
    "& .assessment-MuiDialog-paperWidthSm": {
      maxWidth: "1000px",
    },
  },
  header: {
    paddingTop: "40px",
  },
  center: {
    padding: "20px 30px 20px 30px !important",
  },
  content: {
    padding: "0 !important",
  },
}));

interface AlertDialogProps {
  title?: string;
  text?: string;
  radios?: Array<any>;
  buttons: Array<any>;
  openStatus: boolean;
  handleClose: (text: string) => any;
  handleChange: (value: number) => any;
  radioValue?: number;
  customizeTemplate?: any;
  enableCustomization?: boolean;
  showScheduleInfo?: boolean;
}

interface dateProps {
  modalDate: AlertDialogProps;
}

export default function AlertDialog(props: dateProps) {
  const classes = useStyles();
  const {
    openStatus,
    handleClose,
    customizeTemplate,
    handleChange,
    radioValue,
    title,
    text,
    radios,
    buttons,
    enableCustomization,
    showScheduleInfo,
  } = props.modalDate;
  return (
    <div>
      <Dialog
        open={openStatus}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ zIndex: 1000 }}
        className={showScheduleInfo ? classes.dialogContainer1 : classes.dialogContainer}
      >
        {!enableCustomization ? (
          <>
            {title && (
              <DialogTitle className={classes.header} id="alert-dialog-title">
                {title}
              </DialogTitle>
            )}
            <DialogContent className={classes.center}>
              {radios ? (
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="gender"
                    name="gender1"
                    value={radioValue}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) => handleChange(event.target.value as number)}
                  >
                    {radios.map((item: any, index: number) => (
                      <FormControlLabel key={index} value={item.value} control={<Radio />} label={item.label} />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                <DialogContentText id="alert-dialog-description">{text}</DialogContentText>
              )}
            </DialogContent>
            <DialogActions>
              {buttons.map((item: any, index: number) => (
                <Button key={index} onClick={() => item.event("cancel")} color="primary">
                  {item.label}
                </Button>
              ))}
            </DialogActions>
          </>
        ) : (
          <DialogContent className={classes.content}>{customizeTemplate}</DialogContent>
        )}
      </Dialog>
    </div>
  );
}

import { FixedTable } from "@components/FixedTable";
import { emptyTip } from "@components/TipImages";
import { CSVObjProps, UploadCSV } from "@components/UploadCSV";
import { d, t } from "@locale/LocaleManager";
import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Theme
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { actAsyncConfirm } from "@reducers/confirm";
import { AppDispatch } from "@reducers/index";
import { actError } from "@reducers/notify";
import { unwrapResult } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { LODownloadTemplate } from "./LODownloadTemplate";
import { ErrorsInfoProps, OutcomeHeadersProps, UploadTab } from "./types";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      borderBottom: "1px solid #eeeeee",
    },
    closeBtn: {
      position: "absolute",
      top: "8px",
      right: theme.spacing(1),
    },
    uploadBtn: {
      position: "absolute",
      top: "14px",
      right: theme.spacing(7),
    },
    downloadTemplate: {
      // color: "#000",
      // fontSize: "14px",
      position: "absolute",
      top: "14px",
      right: theme.spacing(28),
    },
    okBtn: {
      marginLeft: "40px !important",
    },
    contentTitle: {
      fontWeight: 600,
      color: "#000",
    },
    uploadInfo: {
      color: "#aaa"
    },
    firstInfo: {
      marginTop: 5,
    },
    errorInfo: {
      color: "rgb(206, 55, 46)",
      marginTop: 5,
      marginBottom: 0,
    },
    tableCon: {
      width: "100%",
      height: "450px",
      // overflow: "hidden",
      paddingBottom: "16px",
    }
  })
);

export interface UploadOutcomeProps {
  open: boolean;
  headers: OutcomeHeadersProps[];
  createLoList: CustomOutcomeProps[];
  updateLoList: CustomOutcomeProps[];
  onClose: () => void;
  onUploadSuccess: (header: string[], array: CSVObjProps[]) => void;
  onConfirm: () => void;
}
export interface CustomOutcomeProps {
  [key: string]: any;
}
export function UploadOutcome(props: UploadOutcomeProps) {
  const css = useStyles();
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState<UploadTab>(UploadTab.create);
  const { headers, createLoList, updateLoList, open, onClose, onUploadSuccess, onConfirm } = props;
  const updateCount = updateLoList.length;
  const createCount = createLoList.length;
  const total = updateCount + createCount;
  const createErrorsInfo: ErrorsInfoProps = useMemo(() => {
    let errorCount = 0;
    let errorRowsSet = new Set<number>();
    let errorColumnsSet = new Set<number>();
    createLoList.forEach((item, i) => {
      headers.forEach((hitem, ii) => {
        const curLo = item[hitem.key];
        const isArray = curLo instanceof Array;
        if (isArray) {
          if (curLo.some((citem) => !!citem.error)) {
            errorCount = errorCount + 1;
            errorRowsSet.add(i);
            errorColumnsSet.add(ii);
          }
        } else {
          if (curLo && curLo.error instanceof Array) {
            if (curLo.error.some((i: any) => !!i)) {
              errorCount = errorCount + 1;
              errorRowsSet.add(i);
              errorColumnsSet.add(ii);
            }
          } else {
            if (curLo && curLo.error) {
              errorCount = errorCount + 1;
              errorRowsSet.add(i);
              errorColumnsSet.add(ii);
            }
          }
        }
      });
    });
    const errorRowsIndex = Array.from(errorRowsSet);
    const errorColumnsIndex = Array.from(errorColumnsSet);
    return { errorCount, errorRowsIndex, errorColumnsIndex };
  }, [createLoList, headers]);
  const updateErrorsInfo: ErrorsInfoProps = useMemo(() => {
    let errorCount = 0;
    let errorRowsSet = new Set<number>();
    let errorColumnsSet = new Set<number>();
    updateLoList.forEach((item, i) => {
      headers.forEach((hitem, ii) => {
        const curLo = item[hitem.key];
        const isArray = curLo instanceof Array;
        if (isArray) {
          if (curLo.some((citem) => !!citem.error)) {
            errorCount = errorCount + 1;
            errorRowsSet.add(i);
            errorColumnsSet.add(ii);
          }
        } else {
          if (curLo && curLo.error instanceof Array) {
            if (curLo.error.some((i: any) => !!i)) {
              errorCount = errorCount + 1;
              errorRowsSet.add(i);
              errorColumnsSet.add(ii);
            }
          } else {
            if (curLo && curLo.error) {
              errorCount = errorCount + 1;
              errorRowsSet.add(i);
              errorColumnsSet.add(ii);
            }
          }
        }
      });
    });
    const errorRowsIndex = Array.from(errorRowsSet);
    const errorColumnsIndex = Array.from(errorColumnsSet);
    return { errorCount, errorRowsIndex, errorColumnsIndex };
  }, [updateLoList, headers]);
  const totalError = createErrorsInfo.errorCount + updateErrorsInfo.errorCount;
  const totalRowsError = createErrorsInfo.errorRowsIndex.length + updateErrorsInfo.errorRowsIndex.length;
  const { confirmDialogActive, openConfirmDialog, closeConfirmDialog } = useConfirmDialog();
  const disableConfirm = useMemo(() => {
    if(totalError > 0 || total === 0) {
      return true;
    } else {
      return false;
    }
  }, [totalError, total])
  const handleConfirm = () => {
    onConfirm();
  };
  const handleUploadSuccess = (header: string[], array: CSVObjProps[]) => {
    if(confirmDialogActive) {
      closeConfirmDialog();
    }
    onUploadSuccess(header, array);
  };

  const handleUploadFail = () => {
    return dispatch(actError(d("Unsupported Format").t("library_error_unsupported_format")));
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, tabValue: UploadTab) => {
    setTabValue(tabValue);
  };
  const handleClickUploadBtn = () => {
    openConfirmDialog();
  };
  const handleClose = async () => {
    if(total > 1) {
      const content = d("Are you discarding current data and leave?").t("assessment_lo_bulk_upload_discard_warning");
      const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, confirmText: d("DISCARD").t("assessment_lo_bulk_upload_discard"), hideCancel: false })));
      if (isConfirmed) {
        onClose();
      }
      if (!isConfirmed) return Promise.reject();
    } else {
      onClose();
    }
  };
  return (
    <>
    <Dialog open={open} fullWidth maxWidth={"lg"}>
      <DialogTitle className={css.title}>
        <span>{"Bulk Upload"}</span>
        <span className={css.downloadTemplate}>
          <LODownloadTemplate />
        </span>
        <div className={css.uploadBtn}>
          {
            total
            ? <Button color="primary" variant="contained" onClick={handleClickUploadBtn}>{d("Upload CSV File").t("assessment_lo_bulk_upload_csv_file")}</Button>
            : <UploadCSV label={d("Upload CSV File").t("assessment_lo_bulk_upload_csv_file")} onUploadSuccess={handleUploadSuccess} onUploadFail={handleUploadFail}/>
        }
        </div>
        <IconButton onClick={handleClose} className={css.closeBtn}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <p className={css.firstInfo}>
          <span className={css.contentTitle}>{d("Check all learning outcomes to upload.").t("assessment_lo_bulk_upload_check_notice")}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span className={css.uploadInfo}>{t("assessment_lo_bulk_upload_result", { count1: total, count2: createCount, count3: updateCount})}</span>
        </p>
        {
          totalError > 0 &&
          <p className={css.errorInfo}>{t("assessment_lo_bulk_upload_error_notice", {count: totalError as number, value: totalRowsError})}</p>
        }
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label={d("Create").t("assessment_lo_bulk_upload_create")} value={UploadTab.create} />
          <Tab label={d("Modify").t("assessment_lo_bulk_upload_modify")} value={UploadTab.modify}/>
        </Tabs>
        <div className={css.tableCon}>
          {
            tabValue === UploadTab.create ?
            (createLoList.length ? 
            <FixedTable headers={headers || []} rows={createLoList} errorInfo={createErrorsInfo} requiredColumns={[6]}  />
            : emptyTip)
            :
            (updateLoList.length ?
            <FixedTable headers={headers || []} rows={updateLoList} errorInfo={updateErrorsInfo} requiredColumns={[6]} />
            : emptyTip)
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disableRipple={true} color="primary" variant="outlined">
          {d("Cancel").t("assessment_lo_bulk_upload_cancel")}
        </Button>
        <Button color="primary" variant="contained" disabled={disableConfirm} className={css.okBtn} onClick={handleConfirm}>
          {d("Confirm").t("assessment_lo_bulk_upload_confirm")}
        </Button>
      </DialogActions>
    </Dialog>
      <ConfirmDialog 
        open={confirmDialogActive}
        onClose={closeConfirmDialog}
        onUpload={handleUploadSuccess}
        onUploadFail={handleUploadFail}
      />
    </>
  );
}

export function useUploadOutcome() {
  const [active, setActive] = useState(false);
  const [uploadOutcomeShowIndex, setUploadOutcomeShowIndex] = useState(0);
  return useMemo(
    () => ({
      uploadOutcomeShowIndex,
      uploadOutcomeActive: active,
      openUploadOutcome: () => {
        setUploadOutcomeShowIndex(uploadOutcomeShowIndex + 1);
        setActive(true);
      },
      closeUploadOutcome: () => {
        setActive(false);
      },
    }),
    [active, uploadOutcomeShowIndex]
  );
}
export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (header: string[], array: CSVObjProps[]) => void;
  onUploadFail: () => void;
}
export function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, onClose, onUpload, onUploadFail } = props;
  return (
    <Dialog open={open}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <DialogContentText>{d("Are you uploading another CSV file and discarding current data?").t("assessment_lo_bulk_reupload")}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disableRipple={true} color="primary">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <UploadCSV variant={"text"} label={d("UPLOAD").t("assessment_lo_bulk_upload_popup_upload")} onUploadSuccess={onUpload} onUploadFail={onUploadFail} />
      </DialogActions>
    </Dialog>
  );
}

export function useConfirmDialog() {
  const [active, setActive] = useState(false);
  const [confirmDialogShowIndex, setConfirmDialogShowIndex] = useState(0);
  return useMemo(
    () => ({
      confirmDialogShowIndex,
      confirmDialogActive: active,
      openConfirmDialog: () => {
        setConfirmDialogShowIndex(confirmDialogShowIndex + 1);
        setActive(true);
      },
      closeConfirmDialog: () => {
        setActive(false);
      },
    }),
    [active, confirmDialogShowIndex, setConfirmDialogShowIndex]
  );
}

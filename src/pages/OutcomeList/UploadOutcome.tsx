import { FixedTable } from "@components/FixedTable";
import { emptyTip } from "@components/TipImages";
import { CSVObjProps, UploadCSV } from "@components/UploadCSV";
import { d } from "@locale/LocaleManager";
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { actAsyncConfirm } from "@reducers/confirm";
import { AppDispatch } from "@reducers/index";
import { actError } from "@reducers/notify";
import { unwrapResult } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { LODownloadTemplate } from "./LODownloadTemplate";
import { ErrorsInfoProps, OutcomeHeadersProps, UploadTab } from "./types";
const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      borderBottom: "1px solid #eeeeee",
    },
    closeBtn: {
      position: "absolute",
      top: "3px",
      right: theme.spacing(1),
    },
    uploadBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(7),
    },
    downloadTemplate: {
      // color: "#000",
      // fontSize: "14px",
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(32),
    },
    okBtn: {
      marginLeft: "40px !important",
    },
    contentTitle: {
      fontWeight: 600,
      color: "#000",
    },
    uploadInfo: {
      color: "#666",
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
    },
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
  // onClick
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
  const handleConfirm = () => {
    onConfirm();
  };
  const handleUploadSuccess = (header: string[], array: CSVObjProps[]) => {
    closeConfirmDialog();
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
    if (total > 1) {
      const content = "Are you discarding current info and leave";
      const { isConfirmed } = unwrapResult(await dispatch(actAsyncConfirm({ content, hideCancel: false })));
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
            {total ? (
              <Button color="primary" variant="contained" onClick={handleClickUploadBtn}>
                {"Upload .csv from device"}
              </Button>
            ) : (
              <UploadCSV label={"Upload .csv from device"} onUploadSuccess={handleUploadSuccess} onUploadFail={handleUploadFail} />
            )}
          </div>
          <IconButton onClick={handleClose} className={css.closeBtn}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p className={css.firstInfo}>
            <span className={css.contentTitle}>{"Check all learning outcomes to upload."}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span className={css.uploadInfo}>{`(There are ${total} to upload, ${createCount} to create, ${updateCount} to modify)`}</span>
          </p>
          {totalError > 0 && (
            <p
              className={css.errorInfo}
            >{`There are totally ${totalError} errors in ${totalRowsError} rows, Check the CSV file based on the highlited cells, and upload again.`}</p>
          )}
          <Tabs value={tabValue} onChange={handleChangeTab} indicatorColor="primary" textColor="primary" centered>
            <Tab label="Create" value={UploadTab.create} />
            <Tab label="Modify" value={UploadTab.modify} />
          </Tabs>
          <div className={css.tableCon}>
            {tabValue === UploadTab.create ? (
              createLoList.length ? (
                <FixedTable headers={headers || []} rows={createLoList} errorInfo={createErrorsInfo} />
              ) : (
                emptyTip
              )
            ) : updateLoList.length ? (
              <FixedTable headers={headers || []} rows={updateLoList} errorInfo={updateErrorsInfo} />
            ) : (
              emptyTip
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disableRipple={true} color="primary" variant="outlined">
            {d("CANCEL").t("general_button_CANCEL")}
          </Button>
          <Button color="primary" variant="contained" disabled={totalError > 0} className={css.okBtn} onClick={handleConfirm}>
            {d("CONFIRM").t("general_button_CONFIRM")}
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
        <DialogContentText>{"Are you uploading another file and discarding current info?"}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disableRipple={true} color="primary">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <UploadCSV label={"UPLOAD"} onUploadSuccess={onUpload} onUploadFail={onUploadFail} />
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

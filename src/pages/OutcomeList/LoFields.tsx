import { CheckboxGroup, CheckboxGroupContext } from "@components/CheckboxGroup";
import { d, t } from "@locale/LocaleManager";
import { formattedNowOrTime, timestampToTime } from "@models/ModelOutcomeDetailForm";
import { Close } from "@mui/icons-material";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ChangeEvent, DOMAttributes, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DownloadOutcomeItemResult, DownloadOutcomeListResult, FieldsProps } from "./types";
const useStyles = makeStyles((theme: Theme) => ({
  fieldsCon: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  fieldsItem: {
    width: "48%",
  },
  title: {
    borderBottom: "1px solid #eeeeee",
  },
  okBtn: {
    marginLeft: "40px !important",
  },
  downloadA: {
    display: "block",
    textDecoration: "none", 
    color: "#fff", 
    width: "calc(100% + 16px)", 
    height: "calc(100% + 6px)", 
  },
  closeBtn: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}))
const FIELDS = "FIELDS";
export interface LoFieldsProps {
  open: boolean;
  list: DownloadOutcomeListResult;
  defaultFields: string[];
  onClose: () => void;
  onBulkDownload: ExportListToCSVBtnProps["onClick"];
  onChangeFields: (fields: LoFieldsProps["defaultFields"]) => void;
}
export function LoFields(props: LoFieldsProps) {
  const css = useStyles();
  const { open, list, defaultFields, onClose, onBulkDownload, onChangeFields } = props;
  const { control, watch } = useForm();
  const values = watch()[FIELDS];
  const outcomeFields: FieldsProps[] = useMemo(() => {
    return  [
      { label: "Learning Outcome Name", value: "outcome_name", checked: true, readonly: false },
      { label: "Short Code", value: "shortcode", checked: true, readonly: false },
      { label: "Assumed", value: "assumed", checked: false, readonly: false },
      { label: "Score Threshold", value: "score_threshold", checked: true, readonly: false },
      { label: "Program", value: "program", checked: true, readonly: true },
      { label: "Subject", value: "subject", checked: true, readonly: true },
      { label: "Category", value: "category", checked: true, readonly: true },
      { label: "Subcategory", value: "subcategory", checked: true, readonly: true },
      { label: "Learning Outcome Set", value: "sets", checked: false, readonly: false },
      { label: "Age", value: "age", checked: false, readonly: false },
      { label: "Grade", value: "grade", checked: false, readonly: false },
      { label: "Keywords", value: "keywords", checked: false, readonly: false },
      { label: "Description", value: "description", checked: false, readonly: false},
      { label: "Author", value: "author", checked: false, readonly: false },
      { label: "Created On", value: "updated_at", checked: true, readonly: false },
      { label: "Milestones", value: "milestones", checked: false, readonly: false },
    ]
  }, []);
  const selectedFields = useMemo(() => {
    return outcomeFields.map(item => {
      const selectedValues = values ? values : defaultFields;
      return {
        ...item,
        checked: selectedValues.indexOf(item.value) >= 0 ? true : false
      }
    })
  }, [defaultFields, outcomeFields, values]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>,selectedContentGroupContext: CheckboxGroupContext) => {
    selectedContentGroupContext.registerChange(e);
    onChangeFields(watch()[FIELDS]);
  }
  return (
    <Dialog open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle className={css.title}>
        {d("Download").t("assessment_lo_download")}
        <IconButton onClick={onClose} className={css.closeBtn}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={css.fieldsCon}>
          <Typography>
            {t("assessment_lo_download_object_quantity", { quantity: list.length.toString() })}
            {/* {d("Select which columns to include:").t("assessment_lo_download_column_title")}
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
            {/* <span style={{color: "#666"}}>{t("assessment_lo_download_object_quantity", { quantity: list.length.toString() })}</span> */}
          </Typography>
          {false && <Controller
            name={FIELDS}
            control={control}
            defaultValue={defaultFields}
            render={({ ref, ...props }) => (
              <CheckboxGroup
                {...props}
                render={(selectedContentGroupContext) => (
                  <div {...{ ref }}>
                    {outcomeFields.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        disabled={item.readonly}
                        className={css.fieldsItem}
                        control={
                          <Checkbox
                            color="primary"
                            value={item.value}
                            checked={selectedContentGroupContext.hashValue[item.value] || false}
                            onChange={(e) => handleChange(e, selectedContentGroupContext)}
                          />
                        }
                        label={item.label}
                      />
                    ))}
                  </div>
                )}
              />
            )}
          />}
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <ExportListToCSVBtn
          list={list}
          fields={selectedFields}
          label={d("CONFIRM").t("general_button_CONFIRM")}
          onClick={onBulkDownload}
        />
      </DialogActions>
    </Dialog>
  )
}

export function useLoFields() {
  const [active, setActive] = useState(false);
  const [loFieldsShowIndex, setLoFieldsShowIndex] = useState(0);
  return useMemo(
    () => ({
      loFieldsShowIndex,
      loFieldsActive: active,
      openLoFields: () => {
        setLoFieldsShowIndex(loFieldsShowIndex + 1);
        setActive(true);
      },
      closeLoFields: () => {
        setActive(false);
      },
    }),
    [active, loFieldsShowIndex]
  );
}

export interface ExportListToCSVBtnProps {
  list: DownloadOutcomeListResult;
  fields: FieldsProps[];
  label: string;
  onClick: () => boolean;
}
export function ExportListToCSVBtn(props: ExportListToCSVBtnProps) {
  const css = useStyles();
  const { list, fields, label, onClick } = props;
  const loName = list[0] && list[0].outcome_name?.split(" ").join("_").slice(0, 20);
  const downloadname = `${formattedNowOrTime()}_${loName}`
  const uri = useMemo(() => {
    let title: string  = "";
    fields.forEach((item) => {
      if(item.checked) {
        title += `${item.label},`;
      }
    });
    const data = 
      list.map(item => {
        const temp: Record<string, any> =  {};
        fields.forEach(fItem => {
          if(fItem.checked) {
            const key = fItem.value as keyof DownloadOutcomeItemResult;
            temp[key] = item[key];
          }
        })
        return {
          ...temp
        }
      });
    let str: string = `${title}\n`;
    data.forEach(item => {
      const keys = Object.keys(item)
      keys.forEach(kItem => {
        const values = item[kItem];
        if(values instanceof Array) {
          str += `"${values.join(";")}",`
        } else if (kItem === "updated_at") {
          str += `\t${timestampToTime(values)},`
        } else if (kItem === "score_threshold") {
          str += `${(values*100).toFixed(0)}%,`
        } else {
          str += `"\t${values}",`
        }
      })
      str += "\n";
    });
    return "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  }, [fields, list])
  const handleClick: DOMAttributes<HTMLAnchorElement>["onClick"] = (e) => {
    if(onClick()) return;
    e.preventDefault();
  }
  return (
    <Button
      color="primary"
      variant="contained"
      className={css.okBtn}
      href={uri}
      download={`${downloadname}.csv`}
      onClick={handleClick}
      >
      {label}
    </Button>
  )
}

import { d } from "@locale/LocaleManager";
import { createStyles, makeStyles } from "@material-ui/core";
import { formattedMonthDay } from "@models/ModelOutcomeDetailForm";
import { useMemo } from "react";
import { FieldsProps } from "./types";
const useStyles = makeStyles((theme) =>
  createStyles({
    downloadA: {
      fontSize: "14px",
      color: "#0E78D5",
      textDecoration: "none"
    },
  })
)

export function LODownloadTemplate() {
  const css = useStyles();
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
  const uri = useMemo(() => {
    let title: string  = "";
    outcomeFields.forEach((item) => {
      title += `${item.label},`;
    });
   return "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(title);
  }, [outcomeFields]);
  const downloadName = `${formattedMonthDay()}-Template-Bulk-Upload.csv`
  return (
    <a 
      className={css.downloadA}
      download={downloadName}
      href={uri}
    >
      {d("Download CSV Template").t("assessment_lo_bulk_upload_template")}
    </a>
  )

}
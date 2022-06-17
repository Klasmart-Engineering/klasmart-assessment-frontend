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
    return [
      { label: d("Learning Outcome Name").t("assess_label_learning_outcome_name"), value: "outcome_name", checked: true, readonly: false },
      { label: d("Short Code").t("assess_label_short_code"), value: "shortcode", checked: true, readonly: false },
      { label: d("Assumed").t("assess_label_assumed"), value: "assumed", checked: false, readonly: false },
      { label: d("Score Threshold").t("learning_outcome_label_threshold"), value: "score_threshold", checked: true, readonly: false },
      { label: d("Program").t("assess_label_program"), value: "program", checked: true, readonly: true },
      { label: d("Subject").t("assess_label_subject"), value: "subject", checked: true, readonly: true },
      { label: d("Category").t("library_label_category"), value: "category", checked: true, readonly: true },
      { label: d("Subcategory").t("library_label_subcategory"), value: "subcategory", checked: true, readonly: true },
      { label: d("Learning Outcome Set").t("assess_set_learning_outcome_set"), value: "sets", checked: false, readonly: false },
      { label: d("Age").t("assess_label_age"), value: "age", checked: false, readonly: false },
      { label: d("Grade").t("assess_label_grade"), value: "grade", checked: false, readonly: false },
      { label: d("Keywords").t("assess_label_keywords"), value: "keywords", checked: false, readonly: false },
      { label: d("Description").t("assess_label_description"), value: "description", checked: false, readonly: false},
      { label: d("Author").t("library_label_author"), value: "author", checked: false, readonly: false },
      { label: d("Created On").t("library_label_created_on"), value: "updated_at", checked: true, readonly: false },
      { label: d("Milestones").t("assess_label_milestone"), value: "milestones", checked: false, readonly: false },
    ];
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
      {"Download .csv Template"}
    </a>
  )

}
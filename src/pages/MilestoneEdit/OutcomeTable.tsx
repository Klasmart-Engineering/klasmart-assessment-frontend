import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { Palette, PaletteColor, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { cloneDeep } from "lodash";
import React from "react";
import { GetOutcomeDetail, GetOutcomeList } from "../../api/type";
import { d } from "../../locale/LocaleManager";
const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles((theme: Theme) => ({
  addGreen: createColor(theme.palette.success, theme.palette),
  removeRead: createColor(theme.palette.error, theme.palette),
  tableContainer: {
    marginTop: 5,
    maxHeight: 790,
    marginBottom: 10,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCell: {
    textAlign: "center",
    maxWidth: 200,
    wordBreak: "break-all",
  },
  liCon: {
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    listStylePosition: "inside",
  },
}));

const stopPropagation =
  <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) =>
  (e: T) => {
    e.stopPropagation();
    if (handler) return handler(e);
  };

interface OutcomeTableProps {
  outcomeList: GetOutcomeList;
  value?: GetOutcomeList;
  onChange?: (value: GetOutcomeList) => any;
  canEdit: boolean;
  onClickOutcome: (id: GetOutcomeDetail["outcome_id"]) => any;
}
export default function OutcomeTable(props: OutcomeTableProps) {
  const { outcomeList, value, onChange, canEdit, onClickOutcome } = props;
  const css = useStyles();

  const handleAction = (item: GetOutcomeDetail, type: "add" | "remove") => {
    const { ancestor_id: id } = item;
    if (type === "add") {
      if (id && value) {
        onChange && onChange(value.concat([item]));
      }
    } else {
      if (id && value) {
        let newValue = cloneDeep(value);
        newValue = newValue.filter((v) => v.ancestor_id !== id);
        onChange && onChange(newValue);
      }
    }
  };

  const rows =
    outcomeList &&
    outcomeList.map((item) => (
      <TableRow key={item.outcome_id} onClick={(e) => onClickOutcome(item.outcome_id)}>
        <TableCell className={css.tableCell}>{item.outcome_name}</TableCell>
        <TableCell className={css.tableCell}>{item.shortcode}</TableCell>
        <TableCell className={css.tableCell}>{item.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
        <TableCell className={css.tableCell}>
          <ul>
            {item.sets?.map((item, index) => (
              <li className={css.liCon} key={`${index}${item.set_name}`}>
                {item.set_name}
              </li>
            ))}
          </ul>
        </TableCell>
        <TableCell className={css.tableCell}>
          {canEdit &&
            (value && value[0] ? (
              value?.map((v) => v.ancestor_id) && value?.map((v) => v.ancestor_id).indexOf(item.ancestor_id) < 0 ? (
                <AddCircle className={css.addGreen} onClick={stopPropagation((e) => handleAction(item, "add"))} />
              ) : (
                <RemoveCircle className={css.removeRead} onClick={stopPropagation((e) => handleAction(item, "remove"))} />
              )
            ) : (
              <AddCircle className={css.addGreen} onClick={stopPropagation((e) => handleAction(item, "add"))} />
            ))}
          {/* {value && value[0] && value.indexOf(item.ancestor_id as string) < 0 ? (
              <AddCircle className={css.addGreen} onClick={() => handleAction(item, "add")} />
            ) : (
              <RemoveCircle className={css.removeRead} onClick={() => handleAction(item, "remove")} />
            )} */}
        </TableCell>
      </TableRow>
    ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
            <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
            <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
            <TableCell className={css.tableCell}>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}

import { RemoveCircle } from "@mui/icons-material";
import { Button, PaletteColor, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { makeStyles } from "@mui/styles";
import { cloneDeep } from "lodash";
import React, { useMemo, useState } from "react";
import { GetOutcomeDetail, GetOutcomeList } from "../../api/type";
import { d } from "../../locale/LocaleManager";

const createColor = (paletteColor: PaletteColor) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles((theme: Theme) => ({
  tableContainer: {
    marginTop: 5,
    maxHeight: 900,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
    textAlign: "center",
  },
  tableCell: {
    maxWidth: 200,
    textAlign: "center",
    wordBreak: "break-all",
  },
  liCon: {
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    listStylePosition: "inside",
  },
  addGreen: createColor(theme.palette.success),
  removeRead: createColor(theme.palette.error),
  pagination: {},
  paginationUl: {
    justifyContent: "center",
  },
}));
const stopPropagation =
  <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) =>
  (e: T) => {
    e.stopPropagation();
    if (handler) return handler(e);
  };
export interface ContainedOutcomeListProps {
  outcomeList: GetOutcomeList;
  value: GetOutcomeList;
  addOrRemoveOutcome: (outcome: GetOutcomeDetail, type: "add" | "remove") => any;
  canEdit: boolean;
  onClickOutcome: (id: GetOutcomeDetail["outcome_id"]) => any;
  isGeneralMilestone: boolean;
}

export default function ContainedOutcomeList(props: ContainedOutcomeListProps) {
  const css = useStyles();
  const { outcomeList, canEdit, isGeneralMilestone, addOrRemoveOutcome, onClickOutcome } = props;
  const [page, setPage] = useState(1);
  const containedList = useMemo(() => {
    const newList = cloneDeep(outcomeList);
    if (isGeneralMilestone) return newList;
    return newList.reverse();
  }, [isGeneralMilestone, outcomeList]);
  const handleChangePage = (e: Object, page: number) => {
    setPage(page);
  };
  const onePageList = useMemo(() => {
    const cloneList = cloneDeep(containedList);
    return cloneList.slice((page - 1) * 10, 10 * page);
  }, [containedList, page]);
  const rows =
    onePageList &&
    onePageList[0] &&
    onePageList.map((item) => (
      <TableRow key={item.outcome_id} onClick={(e) => onClickOutcome(item.outcome_id)}>
        <TableCell className={css.tableCell}>{item.outcome_name}</TableCell>
        <TableCell className={css.tableCell}>{item.shortcode}</TableCell>
        <TableCell className={css.tableCell}>{item.program && item.program[0] ? item.program[0].program_name : ""}</TableCell>
        <TableCell className={css.tableCell}>{item.developmental?.map((v) => v.developmental_name).join(",")}</TableCell>
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
          {/* <AddCircle className={css.addGreen} /> */}
          {canEdit && <RemoveCircle className={css.removeRead} onClick={stopPropagation((e) => addOrRemoveOutcome(item, "remove"))} />}
        </TableCell>
      </TableRow>
    ));
  return (
    <>
      <h1 style={{ marginLeft: 10 }}>
        {d("Contained Learning Outcomes").t("assess_milestone_contained_lo")} {`(${outcomeList.length})`}
      </h1>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table}>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
              <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
              <TableCell className={css.tableCell}>{d("Program").t("assess_column_program")}</TableCell>
              <TableCell className={css.tableCell}>{d("Category").t("assess_label_category")}</TableCell>
              <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
              <TableCell className={css.tableCell}>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell>
              <TableCell className={css.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
      <Pagination
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(containedList.length / 10)}
        color="primary"
        page={page}
      />
    </>
  );
}

export interface AddOutcomesProps {
  onAddOutcome: () => any;
}
export function AddOutcomes(props: AddOutcomesProps) {
  const { onAddOutcome } = props;
  return (
    <div style={{ textAlign: "right" }}>
      <Button variant="contained" color="primary" onClick={onAddOutcome}>
        {d("Add").t("assess_milestone_detail_add")} +
      </Button>
    </div>
  );
}

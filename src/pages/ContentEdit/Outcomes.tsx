import { Box, Button, makeStyles } from "@material-ui/core";
import React, { forwardRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
import { EntityOutcome, ModelPublishedOutcomeView } from "../../api/api.auto";
import { GetOutcomeDetail } from "../../api/type";
import { comingsoonTip, TipImages, TipImagesType } from "../../components/TipImages";
import {
  getOutcomesOptions,
  getOutcomesOptionSkills,
  ISearchPublishedLearningOutcomesParams,
  LinkedMockOptions,
} from "../../reducers/content";
import { OutComesDialog, OutcomesTable } from "./OutcomesRelated";

const useStyles = makeStyles(({ breakpoints, palette, typography }) => ({
  mediaAssets: {
    minHeight: 900,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
    position: "relative",
  },
  addOutcomesButton: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(75,136,245,0.20)",
    borderRadius: 6,
    border: "1px solid #4b88f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    cursor: "pointer",
    color: "#4b88f5",
  },
  addButton: {
    width: "95%",
    margin: "20px 0 14px",
  },
}));

export type ISearchOutcomeQuery = Exclude<ISearchPublishedLearningOutcomesParams, "assumed"> & {
  value?: string;
  exactSerch?: string;
  assumed?: boolean;
};
export type ISearchOutcomeForm = ISearchOutcomeQuery & { program?: string; category?: string };
export interface OutcomesProps {
  comingsoon?: boolean;
  list: ModelPublishedOutcomeView[];
  total: number;
  amountPerPage?: number;
  searchName: string;
  exactSerch: string;
  assumed: boolean;
  onSearch: (query: ISearchOutcomeQuery) => any;
  value?: EntityOutcome[];
  onChange?: (value: EntityOutcome[]) => any;
  onGoOutcomesDetail: (id: GetOutcomeDetail["outcome_id"]) => any;
  outcomePage: number;
  searchLOListOptions: LinkedMockOptions;
  outcomesFullOptions: LinkedMockOptions;
}

export const Outcomes = forwardRef<HTMLDivElement, OutcomesProps>((props, ref) => {
  const css = useStyles();
  const { comingsoon, value, onChange, onGoOutcomesDetail, onSearch, outcomesFullOptions } = props;
  const dispatch = useDispatch();
  const { lesson } = useParams<ContentEditRouteParams>();
  const [open, toggle] = React.useReducer((open) => !open, false);
  const { getValues, control, watch } = useForm<ISearchOutcomeForm>();
  const programId = watch("program")?.split("/")[0];
  const subjectId = watch("program")?.split("/")[1];
  const program_id = programId === "all" ? "" : programId;
  const subject_ids = subjectId?.includes("all") ? "" : subjectId;
  const handleChangeProgram = useMemo(
    () => async (program_id: string) => {
      dispatch(getOutcomesOptions({ metaLoading: true, program_id: program_id === "all" ? "" : program_id }));
    },
    [dispatch]
  );
  const handleChangeSubject = useMemo(
    () => async (subject_ids: string[]) => {
      const subjectId = subject_ids.includes("all") ? [] : subject_ids;

      dispatch(getOutcomesOptions({ metaLoading: true, program_id, subject_ids: subjectId.join(",") }));
    },
    [dispatch, program_id]
  );
  const handleChangeDevelopmental = useMemo(
    () => (developmental_id: string) => {
      const developmentalId = developmental_id === "all" ? "" : developmental_id;
      dispatch(
        getOutcomesOptionSkills({
          metaLoading: true,
          program_id,
          developmental_id: developmentalId,
        })
      );
    },
    [dispatch, program_id]
  );
  const addOutcomeButton = (
    <Button className={css.addOutcomesButton} onClick={toggle}>
      {"Add Learning Outcomes"}
    </Button>
  );
  return (
    <Box className={css.mediaAssets} display="flex" flexDirection="column" alignItems="center" {...{ ref }}>
      {comingsoon && lesson !== "plan" ? (
        comingsoonTip
      ) : (
        <>
          {value && value.length > 0 ? (
            <>
              <div className={css.addButton}>{addOutcomeButton}</div>
              <OutcomesTable
                list={value}
                value={value}
                onChange={onChange}
                onGoOutcomesDetail={onGoOutcomesDetail}
                outcomesFullOptions={outcomesFullOptions}
              />
            </>
          ) : (
            <TipImages type={TipImagesType.empty}>{addOutcomeButton}</TipImages>
          )}
        </>
      )}
      {open && (
        <OutComesDialog
          {...props}
          open={open}
          toggle={toggle}
          control={control}
          onChangeOutcomeProgram={handleChangeProgram}
          onChangeDevelopmental={handleChangeDevelopmental}
          onChangeOutcomeSubject={handleChangeSubject}
          handleClickSearch={({ page, order_by }) => {
            const { program, category, ...resValues } = getValues();
            const category_ids = watch("category")?.split("/")[0];
            const sub_category_ids = watch("category")?.split("/")[1];
            onSearch({
              ...resValues,
              program_ids: program_id,
              subject_ids: subject_ids,
              category_ids: category_ids === "all" ? "" : category_ids,
              sub_category_ids: sub_category_ids === "all" ? "" : sub_category_ids,
              page,
              order_by,
            });
          }}
        />
      )}
    </Box>
  );
});

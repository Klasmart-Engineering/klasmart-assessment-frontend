import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { GetOutcomeDetail, MilestoneDetailResult, MilestoneStatus } from "../../api/type";
import { resultsTip } from "../../components/TipImages";
import { d } from "../../locale/LocaleManager";
import { ModelMilestoneOptions } from "../../models/ModelMilestone";
import { RootState } from "../../reducers";
import {
  AsyncTrunkReturned,
  deleteMilestone,
  getLinkedMockOptions,
  occupyMilestone,
  onLoadMilestoneEdit,
  onLoadOutcomeList,
  saveMilestone,
  updateMilestone,
} from "../../reducers/milestone";
import { actSuccess } from "../../reducers/notify";
import LayoutPair from "../ContentEdit/Layout";
import { TabValue } from "../ContentPreview/type";
import MilestoneList from "../MilestoneList";
import { OutcomeListExectSearch } from "../OutcomeList/types";
import ContainedOutcomeList, { AddOutcomes, ContainedOutcomeListProps, NoOutcome } from "./ContainedOutcomeList";
import ContentTab from "./ContentTab";
import MilestoneForm from "./MilestoneForm";
import { MilestoneHeader } from "./MilestoneHeader";
import { Outcomes, OutcomesProps } from "./Outcomes";
import { OutcomeSearchProps } from "./OutcomeSearch";
import { Regulation } from "./type";
interface RouteParams {
  tab: "details" | "leaningoutcomes";
}
const toQueryString = (hash: Record<string, any>): string => {
  const search = new URLSearchParams(hash);
  return `?${search.toString()}`;
};
export const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};
const setQuery = (search: string, hash: Record<string, string | number | boolean>): string => {
  const query = new URLSearchParams(search);
  Object.keys(hash).forEach((key) => query.set(key, String(hash[key])));
  return query.toString();
};

export interface MilestoneCondition {
  id: string;
  exect_search: string;
  search_key: string;
  assumed: boolean;
  page: number;
  search: string;
}
export const useQueryCms = (): MilestoneCondition => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const id = query.get("id") || "";
  const exect_search = query.get("exect_search") || OutcomeListExectSearch.all;
  const search_key = query.get("search_key") || "";
  const aa = query.get("assumed");
  const assumed = aa ? (aa === "true" ? true : false) : false;
  const page = Number(query.get("page")) || 1;
  return { id, exect_search, search_key, assumed, page, search };
};
function MilestoneEditForm() {
  // const { breakpoints } = useTheme();
  // const sm = useMediaQuery(breakpoints.down("sm"));
  const dispatch = useDispatch();
  const history = useHistory();
  const condition = useQueryCms();
  const { id, exect_search, search_key, assumed, page, search } = condition;
  const formMethods = useForm<MilestoneDetailResult>();
  const { watch, getValues, handleSubmit, setValue, control, errors } = formMethods;
  const { tab } = useParams<RouteParams>();
  const { routeBasePath } = MilestoneEdit;
  const { milestoneDetail, linkedMockOptions, shortCode, outcomeList, outcomeTotal } = useSelector<RootState, RootState["milestone"]>(
    (state) => state.milestone
  );
  const [canEdit, setCanEdit] = useState(false);
  const [regulation, setRegulation] = useState<Regulation>(id ? Regulation.ByMilestoneDetail : Regulation.ByMilestoneDetailAndOptionCount);
  const initDefaultValue = useMemo(
    () => ModelMilestoneOptions.createDefaultValueAndKey({ regulation, milestoneDetail, linkedMockOptions }),
    [linkedMockOptions, milestoneDetail, regulation]
  );
  const value = watch("outcome_ancestor_ids");
  const handleCancel = () => {
    history.push(MilestoneList.routeBasePath);
  };
  const handleSave = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (id) {
          const { payload } = ((await dispatch(updateMilestone({ milestone_id: id, milestone: value }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateMilestone>
          >;
          if (payload === "ok") {
            dispatch(actSuccess(d("Updated Successfully").t("assess_msg_updated_successfully")));
          }
        } else {
          const { payload } = ((await dispatch(saveMilestone(value))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof saveMilestone>
          >;
          if (payload.milestone_id) {
            dispatch(actSuccess(d("Saved Successfully").t("assess_msg_saved_successfully")));
            history.replace({
              search: setQuery(history.location.search, { id: payload.milestone_id }),
            });
          }
        }
      }),
    [dispatch, handleSubmit, history, id]
  );
  const handlePublish = useMemo(
    () =>
      handleSubmit(async (value) => {
        if (!id) {
          const milestone = cloneDeep(value);
          milestone.with_publish = true;
          const { payload } = ((await dispatch(saveMilestone(value))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof saveMilestone>
          >;
          if (payload === "ok") {
            dispatch(actSuccess(d("Published Successfully").t("assess_msg_published_successfully")));
            history.push(MilestoneList.routeBasePath);
          }
        } else {
          const milestone = cloneDeep(value);
          milestone.with_publish = true;
          const { payload } = ((await dispatch(updateMilestone({ milestone_id: id, milestone }))) as unknown) as PayloadAction<
            AsyncTrunkReturned<typeof updateMilestone>
          >;
          if (payload === "ok") {
            dispatch(actSuccess(d("Published Successfully").t("assess_msg_published_successfully")));
            history.push(MilestoneList.routeBasePath);
          }
        }
      }),
    [dispatch, handleSubmit, history, id]
  );
  const handleEdit = async () => {
    if (milestoneDetail.status === MilestoneStatus.published) {
      const { payload } = ((await dispatch(
        occupyMilestone({ id: milestoneDetail.milestone_id as string, metaLoading: true })
      )) as unknown) as PayloadAction<AsyncTrunkReturned<typeof occupyMilestone>>;
      if (payload === "ok") {
        history.push(`/milestone/milestone-edit/tab/details?id=${milestoneDetail}&status=edit`);
        history.push(MilestoneList.routeBasePath);
        setCanEdit(true);
      }
    } else {
      setCanEdit(true);
    }
  };
  const handleDelete = async () => {
    const { payload } = ((await dispatch(deleteMilestone([id]))) as unknown) as PayloadAction<AsyncTrunkReturned<typeof deleteMilestone>>;
    if (payload === "ok") {
      dispatch(actSuccess(d("Deleted Successfully").t("assess_msg_deleted_successfully")));
    }
    dispatch(deleteMilestone([id]));
  };
  const handleChangeTab = useMemo(
    () => (value: string) => {
      history.replace(`${routeBasePath}/tab/${value}${search}`);
    },
    [history, routeBasePath, search]
  );

  const handleChangeProgram = useMemo(
    () => ([programId]: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      dispatch(getLinkedMockOptions({ default_program_id: programId }));
    },
    [dispatch]
  );
  const handleChangeSubject = useMemo(
    () => (default_subject_ids: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      const program = getValues("program_ids") as string[];
      dispatch(getLinkedMockOptions({ default_program_id: program[0], default_subject_ids: default_subject_ids.join(",") }));
    },
    [dispatch, getValues]
  );
  const handleChangeCategory = useMemo(
    () => ([catetory_id]: string[]) => {
      setRegulation(Regulation.ByOptionCount);
      const program = getValues("program_ids") as string[];
      const subject = getValues("subject_ids") as string[];
      dispatch(
        getLinkedMockOptions({
          default_program_id: program[0],
          default_subject_ids: subject.join(","),
          default_developmental_id: catetory_id,
        })
      );
    },
    [dispatch, getValues]
  );
  const handleClickSearch: OutcomeSearchProps["onSearch"] = (exect_search: string, search_key: string, assumed: boolean) => {
    condition.exect_search = exect_search;
    condition.search_key = search_key;
    condition.assumed = assumed;
    condition.page = 1;
    history.push({ search: toQueryString(clearNull(condition)) });
  };
  const handleChangePage: OutcomesProps["onChangePage"] = (page: number) => {
    condition.page = page;
    history.push({ search: toQueryString(clearNull(condition)) });
  };
  const handleAddOrRemoveOutcome: ContainedOutcomeListProps["addOrRemoveOutcome"] = (outcome: GetOutcomeDetail, type: "add" | "remove") => {
    const { outcome_id: id } = outcome;
    if (type === "add") {
      if (id && value) {
        value.concat([outcome.ancestor_id as string]);
      }
    } else {
      if (id && value) {
        let newValue = cloneDeep(value);
        newValue = newValue.filter((v) => v !== id);
        setValue("outcome_ancestor_ids", newValue, { shouldDirty: true });
      }
    }
  };
  const handleClickAdd = () => {
    history.replace(`${routeBasePath}/tab/${TabValue.leaningoutcomes}${search}`);
  };
  useEffect(() => {
    dispatch(onLoadOutcomeList({ exect_search, search_key, assumed: assumed ? 1 : -1, page, metaLoading: true }));
  }, [assumed, dispatch, exect_search, search_key, page]);
  useEffect(() => {
    dispatch(onLoadMilestoneEdit({ id, metaLoading: true }));
    id ? setCanEdit(false) : setCanEdit(true);
  }, [dispatch, id]);
  const leftside = (
    <ContentTab tab={tab} onChangeTab={handleChangeTab} error={errors.milestone_name}>
      <MilestoneForm
        formMethods={formMethods}
        initDefaultValue={initDefaultValue}
        milestoneDetail={milestoneDetail}
        linkedMockOptions={linkedMockOptions}
        onChangeProgram={handleChangeProgram}
        onChangeSubject={handleChangeSubject}
        onChangeCategory={handleChangeCategory}
        milestone_id={id}
        shortCode={shortCode}
        canEdit={canEdit}
      />
      {outcomeList && outcomeList.length ? (
        <Controller
          as={Outcomes}
          name="outcome_ancestor_ids"
          defaultValue={milestoneDetail?.outcomes?.map((v) => v.ancestor_id) || []}
          key={initDefaultValue.outcome_ancestor_ids?.key}
          control={control}
          outcomeList={outcomeList}
          outcomeTotal={outcomeTotal}
          condition={condition}
          onSearch={handleClickSearch}
          outcomePage={page}
          onChangePage={handleChangePage}
          canEdit={canEdit}
        />
      ) : (
        resultsTip
      )}
    </ContentTab>
  );
  const rightside = (
    <>
      {value && value.length ? (
        <ContainedOutcomeList outcomeList={outcomeList} value={value} canEdit={canEdit} addOrRemoveOutcome={handleAddOrRemoveOutcome} />
      ) : (
        <NoOutcome />
      )}
      {tab === TabValue.details && canEdit && <AddOutcomes onAddOutcome={handleClickAdd} />}
    </>
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <MilestoneHeader
        milestoneDetail={milestoneDetail}
        milestone_id={id}
        onCancel={handleCancel}
        onSave={handleSave}
        onPublish={handlePublish}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={canEdit}
        formMethods={formMethods}
      />
      <LayoutPair breakpoint="md" leftWidth={703} rightWidth={1105} spacing={32} basePadding={0} padding={40}>
        {leftside}
        {rightside}
      </LayoutPair>
    </DndProvider>
  );
}

export default function MilestoneEdit() {
  return <MilestoneEditForm />;
}

MilestoneEdit.routeBasePath = "/milestone/milestone-edit";
MilestoneEdit.routeMatchPath = "/milestone/milestone-edit/tab/:tab";
MilestoneEdit.routeRedirectDefault = `/milestone/milestone-edit/tab/details`;

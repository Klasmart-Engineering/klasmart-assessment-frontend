import useQueryCms from "@hooks/useQueryCms";
import { unwrapResult } from "@reduxjs/toolkit";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { MilestoneOrderBy, MilestoneStatus } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { usePermission } from "../../hooks/usePermission";
import { AppDispatch, RootState } from "../../reducers";
import { approveMilestone, bulkApprove, bulkReject, deleteMilestone, onLoadMilestoneList } from "../../reducers/milestone";
import MilestoneEdit from "../MilestoneEdit";
import { MilestoneTable, MilestoneTableProps } from "./MilestoneTable";
import SecondSearchHeader, { SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb, ThirdSearchHeaderProps } from "./ThirdSearchHearder";
import { BulkListForm, BulkListFormKey, MilestoneQueryCondition } from "./types";

interface RefreshWithDispatch {
  // <T>(result: Promise<PayloadAction<T>>): Promise<PayloadAction<T>>;
  <T>(result: Promise<T>): Promise<T>;
}

function useRefreshWithDispatch() {
  const [refreshKey, setRefreshKey] = useState(0);
  const validRef = useRef(false);
  const refreshWithDispatch = useMemo<RefreshWithDispatch>(
    () => (result) => {
      return result.then((res) => {
        setRefreshKey(refreshKey + 1);
        return res;
      });
    },
    [refreshKey]
  );

  useEffect(() => {
    validRef.current = true;
    return () => {
      validRef.current = false;
    };
  });
  return { refreshKey, refreshWithDispatch };
}

const useQuery = (): MilestoneQueryCondition => {
  const { querys, name, page, search_key, description, shortcode, author_id, is_unpub } = useQueryCms();
  const status = querys.get("status") || MilestoneStatus.published;
  const order_by = (querys.get("order_by") as MilestoneOrderBy | null) || undefined;
  return useMemo(() => {
    return clearNull({ name, status, page, order_by, search_key, description, shortcode, author_id, is_unpub });
  }, [name, status, page, order_by, search_key, description, shortcode, author_id, is_unpub]);
};
export default function MilestonesList() {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();
  const condition = useQuery();
  const formMethods = useForm<BulkListForm>();
  const { watch, reset } = formMethods;
  const { refreshKey, refreshWithDispatch } = useRefreshWithDispatch();
  const { milestoneList, total, user_id } = useSelector<RootState, RootState["milestone"]>((state) => state.milestone);
  const ids = watch(BulkListFormKey.CHECKED_BULK_IDS);
  const perm = usePermission([PermissionType.view_unpublished_milestone_417, PermissionType.view_published_milestone_418]);
  const hasPerm = perm.view_published_milestone_418 || perm.view_unpublished_milestone_417;
  const isPending = useMemo(() => perm.view_published_milestone_418 === undefined, [perm.view_published_milestone_418]);
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    history.push({ search: toQueryString(clearNull(value)) });
  };
  const handleBulkDelete: ThirdSearchHeaderProps["onBulkDelete"] = () => {
    return refreshWithDispatch(dispatch(deleteMilestone(ids)));
  };
  const handleDelete: MilestoneTableProps["onDelete"] = (id) => {
    return refreshWithDispatch(dispatch(deleteMilestone([id])));
  };
  const handleChangePage: MilestoneTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickMilestone: MilestoneTableProps["onClickMilestone"] = (milestone_id) => {
    history.push({
      pathname: MilestoneEdit.routeRedirectDefault,
      search: toQueryString(clearNull({ id: milestone_id, is_unpub: condition.is_unpub })),
    });
    // history.push(`/milestone/milestone-edit/tab/details?id=${milestone_id}`);
  };
  const handleReject: MilestoneTableProps["onReject"] = (id) => {
    return refreshWithDispatch(dispatch(bulkReject([id])).then(unwrapResult));
  };
  const handleApprove: MilestoneTableProps["onApprove"] = (id) => {
    return refreshWithDispatch(dispatch(approveMilestone([id])).then(unwrapResult));
  };
  const handleBulkReject = () => {
    return refreshWithDispatch(dispatch(bulkReject(ids)).then(unwrapResult));
  };
  const handleBulkApprove = () => {
    return refreshWithDispatch(dispatch(bulkApprove(ids)).then(unwrapResult));
  };
  useEffect(() => {
    if (milestoneList?.length === 0 && total && total > 0) {
      const page = 1;
      history.push({ search: toQueryString({ ...condition, page }) });
    }
  }, [condition, history, milestoneList, total]);
  useEffect(() => {
    reset();
    (async () => {
      await dispatch(onLoadMilestoneList({ ...condition, metaLoading: true }));
    })();
  }, [condition, dispatch, refreshKey, reset]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {hasPerm && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeader
            value={condition}
            onChange={handleChange}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />
          <ThirdSearchHeaderMb
            value={condition}
            onChange={handleChange}
            onBulkDelete={handleBulkDelete}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
          />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : milestoneList && milestoneList.length > 0 ? (
          <MilestoneTable
            queryCondition={condition}
            formMethods={formMethods}
            total={total}
            list={milestoneList}
            onChangePage={handleChangePage}
            onClickMilestone={handleClickMilestone}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onReject={handleReject}
            user_id={user_id}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </>
  );
}
MilestonesList.routeBasePath = "/milestone/milestone-list";
MilestonesList.routeRedirectDefault = `/milestone/milestone-list?status=${MilestoneStatus.published}&page=1&order_by=${MilestoneOrderBy._created_at}`;

import useQueryCms from "@hooks/useQueryCms";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, HomeFunAssessmentOrderBy, StudyAssessmentOrderBy } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { useRole } from "../../hooks/usePermission";
import { AppDispatch, RootState } from "../../reducers";
import { actAssessmentList } from "../../reducers/assessments";
import { AssessmentsEdit } from "../AssessmentEdit";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { AssessmentQueryCondition } from "./types";
const PAGE_SIZE = 20;

// const clearNull = (obj: Record<string, any>) => {
//   Object.keys(obj).forEach((key) => {
//     if (obj[key] == null) delete obj[key];
//   });
//   return obj;
// };

const useQuery = (): AssessmentQueryCondition => {
  // const { search } = useLocation();
  const { teacher_name, status, page, querys } = useQueryCms();
  //return useMemo(() => {
  //   const query = new URLSearchParams(search);
  //   const teacher_name = query.get("teacher_name");
  //   const status = query.get("status");
  //   const page = Number(query.get("page")) || 1;
  //   const order_by = (query.get("order_by") as AssessmentOrderBy | null) || undefined;
  //   const class_type = query.get("class_type") || AssessmentTypeValues.live;
  const order_by = (querys.get("order_by") as AssessmentOrderBy | null) || undefined;
  const class_type = querys.get("class_type") || AssessmentTypeValues.live;
  return clearNull({ teacher_name, status, page, order_by, class_type });
  //}, [search]);
};

// const toQueryString = (hash: Record<string, any>): string => {
//   const search = new URLSearchParams(hash);
//   return `?${search.toString()}`;
// };

export function AssessmentList() {
  const condition = useQuery();
  const history = useHistory();
  // const perm = usePermission([
  //   PermissionType.view_completed_assessments_414,
  //   PermissionType.view_in_progress_assessments_415,
  //   PermissionType.view_org_completed_assessments_424,
  //   PermissionType.view_org_in_progress_assessments_425,
  //   PermissionType.view_school_completed_assessments_426,
  //   PermissionType.view_school_in_progress_assessments_427,
  // ]);
  // const isPending = useMemo(() => perm.view_completed_assessments_414 === undefined, [perm.view_completed_assessments_414]);
  // const hasPerm =
  //   perm.view_completed_assessments_414 ||
  //   perm.view_in_progress_assessments_415 ||
  //   perm.view_org_completed_assessments_424 ||
  //   perm.view_org_in_progress_assessments_425 ||
  //   perm.view_school_completed_assessments_426 ||
  //   perm.view_school_in_progress_assessments_427;

  const { isPending, hasPerm } = useRole();
  const { assessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) =>
    history.push({ pathname: AssessmentsEdit.routeBasePath, search: toQueryString({ id, classType: condition.class_type }) });
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  const handleChangeAssessmentType = (assessmentType: AssessmentTypeValues) => {
    if (assessmentType === AssessmentTypeValues.live || assessmentType === AssessmentTypeValues.class) {
      history.push(
        `/assessments/assessment-list?class_type=${assessmentType}&status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`
      );
    }
    if (assessmentType === AssessmentTypeValues.homeFun) {
      history.push(`/assessments/home-fun?status=${AssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`);
    }
    if (assessmentType === AssessmentTypeValues.study) {
      history.push(`/assessments/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._create_at}&page=1`);
    }
  };
  useEffect(() => {
    dispatch(actAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);
  return (
    <div>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
          {/* <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} /> */}
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : assessmentList && assessmentList.length > 0 ? (
          <AssessmentTable
            list={assessmentList}
            total={total as number}
            queryCondition={condition}
            onChangePage={handleChangePage}
            onClickAssessment={handleClickAssessment}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </div>
  );
}

// AssessmentList.routeBasePath = "/assessments/assessment-list";
// AssessmentList.routeRedirectDefault = `/assessments/assessment-list?class_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`;

AssessmentList.routeBasePath = "/assessments/list";
AssessmentList.routeRedirectDefault = `/assessments/list?class_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`;

import { usePermission } from "@hooks/usePermission";
import useQueryCms from "@hooks/useQueryCms";
import { DetailAssessment } from "@pages/DetailAssessment";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { ExectSeachType, OrderByAssessmentList } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getAssessmentListV2, getUserListByName } from "../../reducers/assessments";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { AssessmentQueryCondition, SearchListForm } from "./types";

const useQuery = (): AssessmentQueryCondition => {
  const { page, querys } = useQueryCms();
  // const assessment_type = querys.get("assessment_type") || "";
  const query_type = (querys.get("query_type") as ExectSeachType) || ExectSeachType.all;
  const query_key = querys.get("query_key") || "";
  const order_by = (querys.get("order_by") as OrderByAssessmentList) || OrderByAssessmentList._create_at;
  // const status = (querys.get("status") as AssessmentStatus) || "";
  const teacher_name = (querys.get("teacher_name") as string) || "";
  return useMemo(() => {
    return { ...clearNull({ query_key, page, order_by, query_type, teacher_name}) };
  }, [query_key, page, order_by, query_type, teacher_name]);
};
export function ListAssessment() {
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
    PermissionType.view_completed_assessments_414,
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_completed_assessments_426,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const isPending = useMemo(() => perm.view_completed_assessments_414 === undefined, [perm.view_completed_assessments_414]);
  const hasPerm =
    perm.view_completed_assessments_414 ||
    perm.view_in_progress_assessments_415 ||
    perm.view_org_completed_assessments_424 ||
    perm.view_org_in_progress_assessments_425 ||
    perm.view_school_completed_assessments_426 ||
    perm.view_school_in_progress_assessments_427;

  const { assessmentListV2, total, teacherList } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const condition = useQuery();
  const [assessmentTypes, setAssessmentTypes] = useState<string[]>([]);
  const [assessmentStatus, setAssessmentStatus] = useState<string[]>([]);
  const formMethods = useForm<SearchListForm>();
  // const { reset } = formMethods;
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    const newValue = { ...value, assessment_type: assessmentTypes.join(","), status: assessmentStatus.join(",") }
    history.push({ search: toQueryString({...clearNull(newValue)}) });
  };

  const handleChangeAssessmentType: AssessmentTableProps["onChangeAssessmentType"] = (e, value) => {
    let newSelectedAssessmentTypes: string[] = [];
    const index = assessmentTypes.indexOf(value);
    if(index === -1) {
      newSelectedAssessmentTypes = newSelectedAssessmentTypes.concat(assessmentTypes, value)
    } else {
      newSelectedAssessmentTypes = assessmentTypes.filter(item => item !== value);
    }
    setAssessmentTypes(newSelectedAssessmentTypes)
    dispatch(getAssessmentListV2({ ...condition, page: 1, assessment_type: newSelectedAssessmentTypes.join(","), status: assessmentStatus.join(","), metaLoading: true }));
  };

  const handleChangeStatus: AssessmentTableProps["onChangeStatus"] = (e, value) => {
    let newSelectedStatus: string[] = [];
    const index = assessmentStatus.indexOf(value);
    if(index === -1) {
      newSelectedStatus = newSelectedStatus.concat(assessmentStatus, value);
    } else {
      newSelectedStatus = assessmentStatus.filter(item => item !== value);
    }
    setAssessmentStatus(newSelectedStatus);
    dispatch(getAssessmentListV2({ ...condition, page: 1, assessment_type: assessmentTypes.join(","), status: newSelectedStatus.join(","), metaLoading: true }));
  }

  const handleChangePage: AssessmentTableProps["onChangePage"] = (page?: number) => {
    history.push({ search: toQueryString({ ...condition, page, assessment_type: assessmentTypes.join(","), status: assessmentStatus.join(",") }) });
  }
  
    const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id?: string, assessment_type?: string) => {
    history.push({ pathname: DetailAssessment.routeBasePath, search: toQueryString({ id, assessment_type }) });
  };

  const handleSearchTeacherName: SecondSearchHeaderProps["onSearchTeacherName"] = (name) => {
    dispatch(getUserListByName(name));
  };
  
  useEffect(() => {
    dispatch(getAssessmentListV2({ ...condition, assessment_type: assessmentTypes.join(","), status: assessmentStatus.join(","), metaLoading: true }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, dispatch]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader
            value={condition}
            formMethods={formMethods}
            teacherList={teacherList}
            onChange={handleChange}
            onSearchTeacherName={handleSearchTeacherName}
          />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : (
          <>
            <AssessmentTable
              queryCondition={condition}
              assessmentTypes={assessmentTypes}
              assessmentStatus={assessmentStatus}
              list={assessmentListV2}
              total={total || 0}
              onChangePage={handleChangePage}
              onClickAssessment={handleClickAssessment}
              onChangeAssessmentType={handleChangeAssessmentType}
              onChangeStatus={handleChangeStatus}
            />
            {(assessmentListV2 && assessmentListV2.length === 0) && emptyTip}
          </>
        )
      ) : (
        permissionTip
      )}
    </>
  );
}

ListAssessment.routeBasePath = "/assessments/assessment-list";
ListAssessment.routeRedirectDefault = `/assessments/assessment-list?page=1`;

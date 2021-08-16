import { AsyncThunk, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import api, { gqlapi } from "../api";
import { Class, School, Status, User } from "../api/api-ko-schema.auto";
import {
  ClassesTeachingQueryDocument,
  ClassesTeachingQueryQuery,
  ClassesTeachingQueryQueryVariables,
  GetSchoolTeacherDocument,
  GetSchoolTeacherQuery,
  GetSchoolTeacherQueryVariables,
  NotParticipantsByOrganizationDocument,
  NotParticipantsByOrganizationQuery,
  NotParticipantsByOrganizationQueryVariables,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  SchoolAndTeacherByOrgDocument,
  SchoolAndTeacherByOrgQuery,
  SchoolAndTeacherByOrgQueryVariables,
  TeacherByOrgIdDocument,
  TeacherByOrgIdQuery,
  TeacherByOrgIdQueryVariables,
  TeacherListBySchoolIdDocument,
  TeacherListBySchoolIdQuery,
  TeacherListBySchoolIdQueryVariables,
  UserSchoolIDsDocument,
  UserSchoolIDsQuery,
  UserSchoolIDsQueryVariables
} from "../api/api-ko.auto";
import {
  EntityQueryAssignmentsSummaryResult,
  EntityQueryLiveClassesSummaryResult,
  EntityReportListTeachingLoadResult,
  EntityScheduleShortInfo,
  EntityStudentAchievementReportCategoryItem,
  EntityStudentAchievementReportItem,
  // EntityStudentPerformanceH5PReportItem,
  EntityStudentPerformanceReportItem,
  // EntityStudentsPerformanceH5PReportItem,
  EntityTeacherReportCategory
} from "../api/api.auto";
import { apiGetPermission, apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { formatTimeToMonDay, getTimeOffSecond, ModelReport } from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { IWeeks } from "../pages/ReportLearningSummary";
import {
  ArrProps,
  QueryLearningSummaryCondition,
  QueryLearningSummaryRemainingFilterCondition,
  ReportType,
  TimeFilter
} from "../pages/ReportLearningSummary/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
const TIME_OFFSET = ((0 - new Date().getTimezoneOffset() / 60) * 3600).toString();

interface IreportState {
  reportList?: EntityStudentAchievementReportItem[];
  achievementDetail?: EntityStudentAchievementReportCategoryItem[];
  lessonPlanList: EntityScheduleShortInfo[];
  student_name: string | undefined;
  reportMockOptions: GetReportMockOptionsResponse;
  categoriesPage: {
    teacherList: Pick<User, "user_id" | "user_name">[];
    categories: EntityTeacherReportCategory[];
  };
  stuReportMockOptions: GetStuReportMockOptionsResponse;
  h5pReportList?: [];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  h5pReportDetail?: [];
  studentList: Pick<User, "user_id" | "user_name">[];
  teachingLoadOnload: TeachingLoadResponse;
  liveClassSummary: EntityQueryLiveClassesSummaryResult;
  assignmentSummary: EntityQueryAssignmentsSummaryResult;
  summaryReportOptions: IResultLearningSummary;
}
interface RootState {
  report: IreportState;
}
export const initialSateSummaryOptions = {
  schools: [],
  classes: [],
  teachers: [],
  students: [],
  subjects: [],
  school_id: "",
  class_id: "",
  teacher_id: "",
  student_id: "",
  subject_id: "",
};
const initialState: IreportState = {
  reportList: [],
  achievementDetail: [],
  student_name: "",
  reportMockOptions: {
    teacherList: [],
    classList: [],
    lessonPlanList: [],
    teacher_id: "",
    class_id: "",
    lesson_plan_id: "",
  },
  categoriesPage: {
    teacherList: [],
    categories: [],
  },
  stuReportMockOptions: {
    teacherList: [],
    classList: [],
    lessonPlanList: [],
    teacher_id: "",
    class_id: "",
    lesson_plan_id: "",
    student_id: "",
    studentList: [],
  },
  // h5pReportList: [],
  stuReportList: [],
  stuReportDetail: [],
  // h5pReportDetail: [],
  lessonPlanList: [],
  studentList: [],
  teachingLoadOnload: {
    schoolList: [],
    teacherList: [],
    classList: [],
    teachingLoadList: {},
    user_id: "",
  },
  liveClassSummary: {},
  assignmentSummary: {},
  summaryReportOptions: {
    years: [],
    weeks: [],
    schools: [],
    classes: [],
    teachers: [],
    students: [],
    subjects: [],
    year: 2021,
    week_start: 0,
    week_end: 0,
    school_id: "",
    class_id: "",
    teacher_id: "",
    student_id: "",
    subject_id: "",
  },
};

export type AsyncTrunkReturned<Type> = Type extends AsyncThunk<infer X, any, any> ? X : never;
type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type OnloadReportPayload = Parameters<typeof api.reports.listStudentsAchievementReport>[0] & LoadingMetaPayload;
type OnloadReportReturn = AsyncReturnType<typeof api.reports.listStudentsAchievementReport>;
export const getAchievementList = createAsyncThunk<OnloadReportReturn, OnloadReportPayload>(
  "listStudentsAchievementReport",
  async ({ metaLoading, teacher_id, class_id, lesson_plan_id, status, sort_by }) => {
    return await api.reports.listStudentsAchievementReport({ teacher_id, class_id, lesson_plan_id, status, sort_by });
  }
);
interface GetAchievementDetailPayload extends LoadingMetaPayload {
  id: string;
  query: Parameters<typeof api.reports.getStudentAchievementReport>[1];
}

export const getAchievementDetail = createAsyncThunk<
  AsyncReturnType<typeof api.reports.getStudentAchievementReport>,
  GetAchievementDetailPayload
>("StudentsDetailReport", async ({ metaLoading, id, query }) => {
  return await api.reports.getStudentAchievementReport(id, query);
});

type aa = AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>;
export const getLessonPlan = createAsyncThunk<
  AsyncReturnType<typeof api.schedulesLessonPlans.getLessonPlans>,
  Parameters<typeof api.schedulesLessonPlans.getLessonPlans>[0] & LoadingMetaPayload
>("getLessonPlan", async ({ metaLoading, teacher_id, class_id }) => {
  return await api.schedulesLessonPlans.getLessonPlans({ teacher_id, class_id });
});

// export const getClassList = createAsyncThunk<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>("getClassList", async ({ user_id }) => {
//   const { data } = await gqlapi.query<ClassesByTeacherQuery, ClassesByTeacherQueryVariables>({
//     query: ClassesByTeacherDocument,
//     variables: {
//       user_id,
//     },
//   });
//   return data;
// });

export const getClassList = createAsyncThunk<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>(
  "getClassList",
  async ({ user_id, organization_id }) => {
    const { data } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id,
        organization_id,
      },
    });
    return data;
  }
);

// 拉取当前组织下的teacherList
export interface getTeacherListByOrgIdResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
}
export const getTeacherListByOrgId = createAsyncThunk<getTeacherListByOrgIdResponse, string>(
  "getTeacherListByOrgId",
  async (organization_id: string) => {
    const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
      query: TeacherByOrgIdDocument,
      variables: {
        organization_id,
      },
    });
    let teacherList: Pick<User, "user_id" | "user_name">[] = [];
    data.organization?.classes?.forEach((classItem) => {
      teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
    });
    teacherList = ModelReport.teacherListSetDiff(teacherList);
    return { teacherList };
  }
);

export interface GetReportMockOptionsResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
  classList: Pick<Class, "class_id" | "class_name">[];
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  reportList?: EntityStudentAchievementReportItem[];
}
interface GetReportMockOptionsPayLoad {
  teacher_id?: string;
  class_id?: string;
  lesson_plan_id?: string;
  status?: ReportFilter;
  sort_by?: ReportOrderBy;
}

export const reportOnload = createAsyncThunk<GetReportMockOptionsResponse, GetReportMockOptionsPayLoad & LoadingMetaPayload>(
  "reportOnload",
  async ({ teacher_id, class_id, lesson_plan_id, status, sort_by }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let reportList: EntityStudentAchievementReportItem[] = [];
    let lessonPlanList: EntityScheduleShortInfo[] = [];
    let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
    let finalTearchId: string = "";
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const meInfoPerm = await apiGetPermission();
    const myTearchId = meInfo.me?.user_id || "";
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_organizations_reports_612,
        PermissionType.view_my_school_reports_611,
      ],
      meInfoPerm.me
    );
    // const perm = await api.organizationPermissions.hasOrganizationPermissions({
    //   permission_name: premissionAll,
    // })

    //根据权限调接口
    // 1 如果只有看自己的report的权限 finalTeachId => 我自己的user_id
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
      teacherList = [];
      finalTearchId = myTearchId;
    } else {
      // 2 如果有查看自己组织的report的权限或者查看所有report的权限
      //    teacherList => 通过组织id获取所有classes =>所有的teacherid(可能有重复)
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
          query: TeacherByOrgIdDocument,
          variables: {
            organization_id,
          },
        });
        data.organization?.classes?.forEach((classItem) => {
          teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
        });
      }
      // 2 如果有查看自己学校的report的权限或者查看所有report的权限
      //    teacherList => 通过我的user_id 获取我所在的所有学校 => 过滤出当前组织的学校 => 遍历出所有的teacher
      if (perm.view_my_school_reports_611 || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: myTearchId,
          },
        });
        data.user?.school_memberships
          ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
          .map((schoolItem) =>
            schoolItem?.school?.classes?.forEach(
              (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
            )
          );
      }
      // 3 去重
      teacherList = ModelReport.teacherListSetDiff(teacherList);
      finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
      if (!teacherList || !teacherList[0])
        return {
          teacherList: [],
          classList: [],
          lessonPlanList: [],
          teacher_id: "",
          class_id: "",
          lesson_plan_id: "",
        };
    }

    const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id: finalTearchId,
        organization_id,
      },
    });

    const classList = result.user && (result.user.membership?.classesTeaching as Pick<Class, "class_id" | "class_name">[]);
    const firstClassId = classList && classList[0]?.class_id;
    const finalClassId = class_id ? class_id : firstClassId;
    //获取plan_id
    if (finalTearchId && finalClassId) {
      const data = await api.schedulesLessonPlans.getLessonPlans({
        teacher_id: (finalTearchId as string) || "",
        class_id: (finalClassId as string) || "",
      });
      lessonPlanList = data || [];
    }
    const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0]?.id || "";
    if (finalPlanId) {
      const items = await api.reports.listStudentsAchievementReport({
        teacher_id: finalTearchId,
        class_id: finalClassId || "",
        lesson_plan_id: finalPlanId as string,
        status,
        sort_by,
      });
      reportList = items.items || [];
    }
    return {
      teacherList,
      classList: classList || [],
      lessonPlanList: lessonPlanList,
      teacher_id: finalTearchId,
      class_id: finalClassId || "",
      lesson_plan_id: finalPlanId || "",
      reportList,
    };
  }
);

export const resetReportMockOptions = createAsyncThunk<null>("report/resetReportMockOptions", () => {
  return null;
});

interface ReportCategoriesPayLoadProps {
  teacher_id?: string;
}
interface ReportCategoriesPayLoadResult {
  teacherList: Pick<User, "user_id" | "user_name">[];
  categories: EntityTeacherReportCategory[];
}
export const reportCategoriesOnload = createAsyncThunk<ReportCategoriesPayLoadResult, ReportCategoriesPayLoadProps & LoadingMetaPayload>(
  "report/reportCategoriesOnload",
  async ({ teacher_id }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    //拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const meInfoPerm = await apiGetPermission();
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_school_reports_611,
        PermissionType.view_my_organizations_reports_612,
      ],
      meInfoPerm.me
    );
    const my_id = meInfo?.me?.user_id || "";

    if (perm.view_reports_610 || perm.view_my_school_reports_611 || perm.view_my_organizations_reports_612) {
      let teacherList: Pick<User, "user_id" | "user_name">[] = [];
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
          query: TeacherByOrgIdDocument,
          variables: {
            organization_id,
          },
        });
        data.organization?.classes?.forEach((classItem) => {
          teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
        });
      }
      if (perm.view_my_school_reports_611 || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: my_id,
          },
        });
        data.user?.school_memberships
          ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
          .map((schoolItem) =>
            schoolItem?.school?.classes?.forEach(
              (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
            )
          );
      }
      teacherList = ModelReport.teacherListSetDiff(teacherList);
      // teacherList 不存在，不需要拉取 categories
      if (!teacherList || !teacherList[0]) return { teacherList: [], categories: [] };
      // 如果 teacher_id 就直接使用，不然就用列表第一项
      const { categories } = { ...(await api.reports.getTeacherReport(teacher_id || teacherList[0]?.user_id)) };
      return { teacherList, categories: categories ?? [] };
    }

    if (perm.view_my_reports_614) {
      if (!my_id) return { teacherList: [], categories: [] };
      const { categories } = { ...(await api.reports.getTeacherReport(my_id)) };
      return { teacherList: [], categories: categories ?? [] };
    }
    return { teacherList: [], categories: [] };
  }
);
export interface GetStuReportMockOptionsResponse {
  teacherList: Pick<User, "user_id" | "user_name">[];
  classList: Pick<Class, "class_id" | "class_name">[];
  lessonPlanList: EntityScheduleShortInfo[];
  teacher_id: string;
  class_id: string;
  lesson_plan_id: string;
  student_id?: string;
  reportList?: EntityStudentAchievementReportItem[];
  studentList?: Pick<User, "user_id" | "user_name">[];
  // h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
  stuReportList?: EntityStudentPerformanceReportItem[];
  stuReportDetail?: EntityStudentPerformanceReportItem[];
  // h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
}

export interface GetTeachingLoadListPayLoad {
  school_id?: string;
  teacher_ids?: string;
  class_ids?: string;
  time_offset: string;
  page?: number;
  size?: number;
}
export const getTeachingLoadList = createAsyncThunk<EntityReportListTeachingLoadResult, GetTeachingLoadListPayLoad & LoadingMetaPayload>(
  "getTeachingLoad",
  async (query) => {
    return await api.reports.listTeachingLoadReport(query);
  }
);
export interface TeachingLoadPayload {
  school_id: string;
  teacher_ids: string;
  class_ids: string;
}
export interface TeachingLoadResponse {
  schoolList?: Pick<School, "school_id" | "school_name">[];
  teacherList?: Pick<User, "user_id" | "user_name">[];
  classList?: Pick<Class, "class_id" | "class_name">[];
  teachingLoadList: EntityReportListTeachingLoadResult;
  user_id: string;
}
export const teachingLoadOnload = createAsyncThunk<TeachingLoadResponse, TeachingLoadPayload & LoadingMetaPayload>(
  "teachingLoadOnload",
  async ({ school_id, teacher_ids, class_ids }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let teachingLoadList: EntityReportListTeachingLoadResult = {};
    let schoolList: Pick<School, "school_id" | "school_name">[] | undefined = [];
    let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
    let classList: Pick<Class, "class_id" | "class_name">[] | undefined = [];
    let newteacher_ids: string = teacher_ids;
    // 拉取我的user_id
    const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
      query: QeuryMeDocument,
      variables: {
        organization_id,
      },
    });
    const user_id = meInfo.me?.user_id || "";
    const perm = hasPermissionOfMe(
      [
        PermissionType.view_my_reports_614,
        PermissionType.view_reports_610,
        PermissionType.view_my_organizations_reports_612,
        PermissionType.view_my_school_reports_611,
      ],
      meInfo.me
    );
    if (
      !perm.view_my_reports_614 &&
      !perm.view_reports_610 &&
      !perm.view_my_school_reports_611 &&
      !perm.view_my_organizations_reports_612
    ) {
      return {
        schoolList,
        teacherList,
        classList,
        teachingLoadList,
        user_id,
      };
    }
    const my_id = meInfo?.me?.user_id || "";
    if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
      teacherList = [{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }];
      newteacher_ids = my_id;
      // 获取我所在的本组织的学校
      const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
        query: GetSchoolTeacherDocument,
        variables: {
          user_id: my_id,
        },
      });
      const newSchoolList = data.user?.school_memberships
        ?.filter(
          (schoolItem) =>
            schoolItem?.school?.organization?.organization_id === organization_id && schoolItem.school.status === Status.Active
        )
        .map((schoolMember) => schoolMember?.school) as Pick<School, "school_id" | "school_name">[];
      schoolList = schoolList.concat(newSchoolList);
      const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
        query: ClassesTeachingQueryDocument,
        variables: {
          user_id: my_id,
          organization_id,
        },
      });
      result.user?.membership?.classesTeaching
        ?.filter((classItem) => classItem?.status === Status.Active)
        .forEach((classItem) => {
          schoolList = schoolList?.concat(classItem?.schools as Pick<School, "school_id" | "school_name">[]);
        });

      teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
    } else {
      if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
        const { data: schoolListResult } = await gqlapi.query<SchoolAndTeacherByOrgQuery, SchoolAndTeacherByOrgQueryVariables>({
          query: SchoolAndTeacherByOrgDocument,
          variables: {
            organization_id: organization_id,
          },
        });
        schoolListResult.organization?.schools?.forEach((schoolItem) => {
          if (schoolItem?.status === Status.Active) {
            schoolList?.push(schoolItem as Pick<School, "school_id" | "school_name">);
          }
        });
        if (school_id === "all") {
          // 获取本组织下的所有在学校的老师
          const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
            query: TeacherByOrgIdDocument,
            variables: {
              organization_id,
            },
          });
          data.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active) {
              teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
            }
          });
          const { data: notParticipantsdata } = await gqlapi.query<
            NotParticipantsByOrganizationQuery,
            NotParticipantsByOrganizationQueryVariables
          >({
            query: NotParticipantsByOrganizationDocument,
            variables: {
              organization_id,
            },
          });
          notParticipantsdata.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active && classItem.schools?.length === 0) {
              const newTeacherList = classItem?.teachers
                ?.map((teacherItem) => {
                  // const isThisOrg =
                  //   teacherItem?.school_memberships?.some(
                  //     (schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id
                  //   ) || false;
                  // return teacherItem?.school_memberships?.length === 0 || !isThisOrg ? teacherItem : { user_id: "", user_name: "" };
                  return teacherItem;
                })
                .filter((item) => item?.user_id !== "");
              teacherList = teacherList?.concat(newTeacherList as Pick<User, "user_id" | "user_name">[]);
            }
          });
        } else if (school_id === "no_assigned") {
          // 获取本组织下不属于任何学校的老师
          const { data } = await gqlapi.query<NotParticipantsByOrganizationQuery, NotParticipantsByOrganizationQueryVariables>({
            query: NotParticipantsByOrganizationDocument,
            variables: {
              organization_id,
            },
          });
          data.organization?.classes?.forEach((classItem) => {
            if (classItem?.status === Status.Active && classItem.schools?.length === 0) {
              const newTeacherList = classItem?.teachers
                ?.map((teacherItem) => {
                  return teacherItem;
                })
                .filter((item) => item?.user_id !== "");
              teacherList = teacherList?.concat(newTeacherList as Pick<User, "user_id" | "user_name">[]);
            }
          });
        } else {
          // 获取指定school_id下的老师
          const { data } = await gqlapi.query<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>({
            query: TeacherListBySchoolIdDocument,
            variables: {
              school_id,
            },
          });
          data.school?.classes?.forEach((classItem) => {
            teacherList = teacherList?.concat(
              (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
            );
          });
        }
      }
      if ((!perm.view_my_organizations_reports_612 && perm.view_my_school_reports_611) || perm.view_reports_610) {
        const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
          query: GetSchoolTeacherDocument,
          variables: {
            user_id: my_id,
          },
        });
        const newSchoolList = data.user?.school_memberships
          ?.filter(
            (schoolItem) =>
              schoolItem?.school?.organization?.organization_id === organization_id && schoolItem.school.status === Status.Active
          )
          .map((schoolMember) => schoolMember?.school) as Pick<School, "school_id" | "school_name">[];
        schoolList = schoolList.concat(newSchoolList);
        if (perm.view_my_reports_614) {
          const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
            query: ClassesTeachingQueryDocument,
            variables: {
              user_id: my_id,
              organization_id,
            },
          });
          result.user?.membership?.classesTeaching
            ?.filter((classItem) => classItem?.status === Status.Active)
            .forEach((classItem) => {
              schoolList = schoolList?.concat(classItem?.schools as Pick<School, "school_id" | "school_name">[]);
            });

          teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        }

        if (school_id === "all") {
          data.user?.school_memberships
            ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
            .map((schoolItem) =>
              schoolItem?.school?.classes?.forEach(
                (classItem) =>
                  (teacherList = teacherList?.concat(
                    (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
                  ))
              )
            );
          if (perm.view_my_reports_614) {
            teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
          }
        } else if (school_id !== "no_assigned") {
          // 获取指定school_id下的老师
          const { data } = await gqlapi.query<TeacherListBySchoolIdQuery, TeacherListBySchoolIdQueryVariables>({
            query: TeacherListBySchoolIdDocument,
            variables: {
              school_id,
            },
          });
          data.school?.classes?.forEach((classItem) => {
            teacherList = teacherList?.concat(
              (classItem?.status === Status.Active ? classItem?.teachers : []) as Pick<User, "user_id" | "user_name">[]
            );
          });
        } else if (perm.view_my_reports_614) {
          teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        }
        //  else if (perm.view_my_reports_614) {
        //   teacherList = teacherList.concat([{ user_id: my_id, user_name: meInfo?.me?.user_name || "" }]);
        // }
      }
    }

    const teacherIdList = newteacher_ids.split(",");
    if (teacherIdList.length === 1 && newteacher_ids !== "all") {
      const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
        query: ClassesTeachingQueryDocument,
        variables: {
          user_id: newteacher_ids,
          organization_id,
        },
      });
      let classListall = result.user?.membership?.classesTeaching;
      if (school_id && school_id !== "all" && school_id !== "no_assigned") {
        classListall = classListall?.filter((classItem) => classItem?.schools?.some((school) => school?.school_id === school_id));
      }
      if (school_id === "no_assigned") {
        classListall = classListall?.filter((classItem) => classItem?.schools?.length === 0);
      }
      classList = classList?.concat(
        classListall?.filter((classItem) => classItem?.status === Status.Active) as Pick<Class, "class_id" | "class_name">[]
      );
    }
    teacherList = ModelReport.teacherListSetDiff(teacherList);
    schoolList = ModelReport.schoolListSetDiff(schoolList);
    teachingLoadList =
      (await api.reports.listTeachingLoadReport({ school_id, teacher_ids: newteacher_ids, class_ids, time_offset: TIME_OFFSET })) || [];
    return {
      schoolList,
      teacherList,
      classList,
      teachingLoadList,
      user_id,
    };
  }
);
export type IParamsQueryLiveClassSummary = Parameters<typeof api.reports.queryLiveClassesSummary>[0];
export type IResultQueryLiveClassSummary = AsyncReturnType<typeof api.reports.queryLiveClassesSummary>;
export const getLiveClassesSummary = createAsyncThunk<IResultQueryLiveClassSummary, IParamsQueryLiveClassSummary & LoadingMetaPayload>(
  "getLiveClassesSummary",
  async (query) => {
    const { subject_id } = query;
    const res = await api.reports.queryLiveClassesSummary({ ...query, subject_id: subject_id === "all" ? "" : subject_id });
    return res;
  }
);

export type IParamsQueryAssignmentSummary = Parameters<typeof api.reports.queryAssignmentsSummary>[0];
export type IResultQueryAssignmentSummary = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export const getAssignmentSummary = createAsyncThunk<IResultQueryAssignmentSummary, IParamsQueryAssignmentSummary & LoadingMetaPayload>(
  "getAssingmentSummary",
  async (query) => {
    const { subject_id } = query;
    const res = await api.reports.queryAssignmentsSummary({ ...query, subject_id: subject_id === "all" ? "" : subject_id });
    return res;
  }
);

export type IParamQueryTimeFilter = Parameters<typeof api.reports.queryLearningSummaryTimeFilter>[0];
export type IResultQueryTimeFilter = AsyncReturnType<typeof api.reports.queryLearningSummaryTimeFilter>;
export const getTimeFilter = createAsyncThunk<IResultQueryTimeFilter, IParamQueryTimeFilter & LoadingMetaPayload>(
  "getTimeFilter",
  async ({ metaLoading, ...query }) => {
    return await api.reports.queryLearningSummaryTimeFilter({ ...query });
  }
);

export type IParamQueryRemainFilter = Parameters<typeof api.reports.queryLearningSummaryRemainingFilter>[0];
export type IResultQueryRemainFilter = AsyncReturnType<typeof api.reports.queryLearningSummaryRemainingFilter>;
export const getRemainFilter = createAsyncThunk<IResultQueryRemainFilter, IParamQueryRemainFilter & LoadingMetaPayload>(
  "getRemainFilter",
  async (query) => {
    return await api.reports.queryLearningSummaryRemainingFilter({ ...query });
  }
);
export interface IParamsOnLoadLearningSummary {
  summary_type: string;
}

export interface IParamsLearningSummary extends QueryLearningSummaryCondition {
  isOrg?: boolean;
  isSchool?: boolean;
  isTeacher?: boolean;
  isStudent?: boolean;
  year?: number;
  subject_id?: string;
  summary_type: QueryLearningSummaryRemainingFilterCondition["summary_type"];
}
export interface IResultLearningSummary {
  years: number[];
  weeks: IWeeks[];
  schools?: ArrProps[];
  classes?: ArrProps[];
  teachers?: ArrProps[];
  students?: ArrProps[];
  subjects?: ArrProps[];
  year?: number;
  week_start?: number;
  week_end?: number;
  school_id?: string;
  class_id?: string;
  teacher_id?: string;
  student_id?: string;
  subject_id?: string;
}
export const onLoadLearningSummary = createAsyncThunk<
  IResultLearningSummary,
  IParamsLearningSummary & LoadingMetaPayload,
  { state: RootState }
>("onLoadLearningSummary", async ({ metaLoading, ...query }, { getState, dispatch }) => {
  const { week_end, week_start, year, summary_type, school_id, class_id, teacher_id, student_id, subject_id } = query;
  let years: number[] = [];
  let weeks: IWeeks[] = [];
  let subjects: ArrProps[] = [];
  let schools: ArrProps[] = [];
  let classes: ArrProps[] = [];
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let _year: number;
  let _school_id: string | undefined = "";
  let _class_id: string | undefined = "";
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  let mySchoolId: string | undefined = "";
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  // 拉取我的user_id
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  const myUserId = meInfo.me?.user_id;

  const perm = hasPermissionOfMe(
    [
      PermissionType.report_learning_summary_org_652,
      PermissionType.report_learning_summary_school_651,
      PermissionType.report_learning_summary_teacher_650,
      PermissionType.report_learning_summary_student_649,
    ],
    meInfo.me
  );
  const isOrg = perm.report_learning_summary_org_652;
  const isSchool = perm.report_learning_summary_school_651;
  const isTeacher = perm.report_learning_summary_teacher_650;
  const isStudent = perm.report_learning_summary_student_649;
  const isOnlyStudent = isStudent && !isOrg && !isSchool && !isTeacher
  const {
    report: { summaryReportOptions },
  } = getState();
  if (isSchool && !isOrg) {
    const data = await gqlapi.query<UserSchoolIDsQuery, UserSchoolIDsQueryVariables>({
      query: UserSchoolIDsDocument,
      variables: {
        user_id: myUserId as string,
      },
    });
    mySchoolId = data.data.user?.school_memberships?.map((item) => item?.school_id).join(",");
  }
  if (!summaryReportOptions.years.length && !summaryReportOptions.weeks.length) {
    const params = { time_offset: getTimeOffSecond(), summary_type };
    let timeFilterParams: IParamQueryTimeFilter = { ...params };
    if (!isOrg && isSchool) {
      timeFilterParams = { ...params, school_ids: mySchoolId };
    }
    if (!isOrg && !isSchool && isTeacher) {
      timeFilterParams = { ...params, teacher_id: myUserId };
    }
    if (!isOrg && !isSchool && !isTeacher && isStudent) {
      timeFilterParams = { ...params, student_id: myUserId };
    }
    const timeFilter = await api.reports.queryLearningSummaryTimeFilter({ ...timeFilterParams });
    years = timeFilter.length ? timeFilter.map((item) => item.year as number) : [2021];
    _year = years[years.length - 1];
    const _weeks = timeFilter.length ? timeFilter.find((item) => item.year === _year)?.weeks : [];
    weeks = _weeks
      ? _weeks.map((item) => {
          const week_start = item.week_start as number;
          const week_end = item.week_end as number;
          return {
            week_start,
            week_end,
            value: `${formatTimeToMonDay(week_start as number)}~${formatTimeToMonDay(week_end as number)}`,
          };
        })
      : [];
  } else {
    years = summaryReportOptions.years;
    weeks = summaryReportOptions.weeks;
  }
  _year = year ? year : years[years.length - 1];
  const lastWeek = weeks[weeks.length - 1];
  const _week_start = week_start ? week_start : lastWeek.week_start;
  const _week_end = week_end ? week_end : lastWeek.week_end;
  if (isOrg) {
    const _schools = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "school",
      week_start: _week_start,
      week_end: _week_end,
    });
    schools = _schools.map((item) => {
      return {
        id: item.school_id,
        name: item.school_name,
      };
    });
    _school_id = schools.length ? schools[0].id : school_id;
  }
  if (isSchool || isOrg) {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "class",
      week_start: _week_start,
      week_end: _week_end,
      school_id: _school_id ? _school_id : mySchoolId,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? classes[0].id : class_id;
    const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "teacher",
      week_start: _week_start,
      week_end: _week_end,
      class_id: _class_id,
    });
    teachers = _teachers.map((item) => {
      return {
        id: item.teacher_id,
        name: item.teacher_name,
      };
    });
    _teacher_id = teachers.length ? teachers[0].id : teacher_id;
  }
  if (isTeacher && !isOrg && !isSchool) {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "class",
      week_start: _week_start,
      week_end: _week_end,
      teacher_id: myUserId,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? classes[0].id : class_id;
    const _students = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "student",
      week_start: _week_start,
      week_end: _week_end,
      class_id: _class_id,
    });
    students = _students.map((item) => {
      return {
        id: item.student_id,
        name: item.student_name,
      };
    });
    _student_id = students.length ? students[0].id : student_id;
  } else if (isOrg || isSchool) {
    const _students = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "student",
      week_start: _week_start,
      week_end: _week_end,
      class_id: _class_id,
      teacher_id: _teacher_id,
    });
    students = _students.map((item) => {
      return {
        id: item.student_id,
        name: item.student_name,
      };
    });
    _student_id = students.length ? students[0].id : student_id;
  }
  const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
    summary_type,
    filter_type: "subject",
    week_start: _week_start,
    week_end: _week_end,
    student_id: (isStudent && !isTeacher && !isOrg && !isSchool) ? myUserId : _student_id,
  });
  subjects = _subjects.map((item) => {
    return {
      id: item.subject_id,
      name: item.subject_name,
    };
  });
  subjects.unshift({ id: "all", name: "All" });
  _subject_id = subject_id ? subject_id : subjects[0].id;
  if (isStudent && !isTeacher && !isSchool && !isOrg) {
    _student_id = _student_id ? _student_id : myUserId;
  }
  const isLiveClass = summary_type === ReportType.live;
  const params = {
    year: _year,
    week_start: _week_start,
    week_end: _week_end,
    school_id: _school_id,
    class_id: _class_id,
    teacher_id: _teacher_id,
    student_id: _student_id ? _student_id : isOnlyStudent ? myUserId : "",
    subject_id: _subject_id,
  };
  if (_year && _week_start && _week_end && _student_id && _subject_id) {
    if (subject_id === "all") {
      isLiveClass
        ? await dispatch(getLiveClassesSummary({ ...params, subject_id: "", metaLoading }))
        : await dispatch(getAssignmentSummary({ ...params, subject_id: "", metaLoading }));
    } else {
      isLiveClass
        ? await dispatch(getLiveClassesSummary({ ...params, metaLoading }))
        : await dispatch(getAssignmentSummary({ ...params, metaLoading }));
    }
  }
  return { years, weeks, schools, classes, teachers, students, subjects, ...params };
});

export interface IParamsGetAfterClassFilter extends IParamQueryRemainFilter {
  isOrg: boolean;
  isSchool: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}
export type IResultGetAfterClassFilter = {
  classes?: ArrProps[];
  school_id?: string;
  teachers?: ArrProps[];
  students?: ArrProps[];
  subjects?: ArrProps[];
  class_id?: string;
  teacher_id?: string;
  student_id?: string;
  subject_id?: string;
  summary_type: string;
  filter_type: string;
};
export const getAfterClassFilter = createAsyncThunk<
  IResultGetAfterClassFilter,
  IParamsGetAfterClassFilter & LoadingMetaPayload,
  { state: RootState }
>("getAfterClassFilter", async (query, { getState, dispatch }) => {
  const {
    summary_type,
    filter_type,
    school_id,
    class_id,
    teacher_id,
    student_id,
    week_start,
    week_end,
    isOrg,
    isSchool,
    isTeacher,
  } = query;
  let classes: ArrProps[] = [];
  let teachers: ArrProps[] = [];
  let students: ArrProps[] = [];
  let subjects: ArrProps[] = [];
  let _class_id: string | undefined = "";
  let _teacher_id: string | undefined = "";
  let _student_id: string | undefined = "";
  let _subject_id: string | undefined = "";
  if (filter_type === "class") {
    const _classes = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type,
      week_start,
      week_end,
      school_id,
    });
    classes = _classes.map((item) => {
      return {
        id: item.class_id,
        name: item.class_name,
      };
    });
    _class_id = classes.length ? classes[0].id : "";
  }
  if (filter_type === "teacher" || filter_type === "class") {
    if (isOrg || isSchool) {
      const _teachers = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "teacher",
        week_start,
        week_end,
        class_id: filter_type === "teacher" ? class_id : _class_id,
      });
      teachers = _teachers.map((item) => {
        return {
          id: item.teacher_id,
          name: item.teacher_name,
        };
      });
      _teacher_id = teachers.length ? teachers[0].id : "";
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id: _class_id ? _class_id : class_id,
        teacher_id: _teacher_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "";
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "";
    }
  }
  if (filter_type === "student") {
    if (isOrg || isSchool) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
        teacher_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students ? students[0].id : "";
    } else if (isTeacher) {
      const _students = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "student",
        week_start,
        week_end,
        class_id,
      });
      students = _students.map((item) => {
        return {
          id: item.student_id,
          name: item.student_name,
        };
      });
      _student_id = students.length ? students[0].id : "";
    }
  }
  if (filter_type === "teacher" || filter_type === "student" || filter_type === "class") {
    const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
      summary_type,
      filter_type: "subject",
      week_start,
      week_end,
      student_id: _student_id,
    });
    subjects = _subjects.map((item) => {
      return {
        id: item.subject_id,
        name: item.subject_name,
      };
    });
    subjects.unshift({ id: "all", name: "All" });
    _subject_id = subjects[0].id;
  }
  if (filter_type === "subject") {
    if (isOrg || isSchool || isTeacher) {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type: "subject",
        week_start,
        week_end,
        student_id: student_id,
      });
      subjects = _subjects.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
      subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects[0].id;
    } else {
      const _subjects = await api.reports.queryLearningSummaryRemainingFilter({
        summary_type,
        filter_type,
        week_start,
        week_end,
        student_id,
      });
      subjects = _subjects.map((item) => {
        return {
          id: item.subject_id,
          name: item.subject_name,
        };
      });
      subjects.unshift({ id: "all", name: "All" });
      _subject_id = subjects[0].id;
    }
  }
  const {
    report: { summaryReportOptions },
  } = getState();
  const params = {
    week_start,
    week_end,
    school_id: school_id ? school_id : summaryReportOptions.school_id,
    class_id: school_id ? _class_id : class_id ? class_id : summaryReportOptions.class_id,
    teacher_id: (school_id) ? _teacher_id : filter_type === "student" ? teacher_id  : summaryReportOptions.teacher_id,
    student_id: (school_id || class_id || teacher_id) ? _student_id : student_id,
    subject_id: _subject_id,
    metaLoading: true,
  };
  if (params.student_id && params.subject_id) {
    summary_type === ReportType.live ? dispatch(getLiveClassesSummary({ ...params })) : dispatch(getAssignmentSummary({ ...params }));
  }
  if (filter_type === "class") {
    return {
      classes,
      teachers,
      students,
      subjects,
      school_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
      summary_type,
      filter_type,
    };
  } else if (filter_type === "teacher") {
    return {
      teachers,
      students,
      subjects,
      class_id,
      teacher_id: _teacher_id,
      student_id: _student_id,
      subject_id: _subject_id,
      summary_type,
      filter_type,
    };
  } else if (filter_type === "student") {
    return {
      students,
      subjects,
      teacher_id,
      class_id,
      student_id: _student_id,
      subject_id: _subject_id,
      summary_type,
      filter_type,
    };
  } else {
    return {
      student_id,
      subjects,
      subject_id: _subject_id,
      summary_type,
      filter_type,
    };
  }
});

interface GetClassListPayload {
  school_id: string;
  teacher_ids: string;
}
interface GetClassListResponse {
  classList: Pick<Class, "class_id" | "class_name">[];
}
export const getClassListByschool = createAsyncThunk<GetClassListResponse, GetClassListPayload & LoadingMetaPayload>(
  "getClassList",
  async ({ school_id, teacher_ids }) => {
    const organization_id = (await apiWaitForOrganizationOfPage()) as string;
    let classList: Pick<Class, "class_id" | "class_name">[] | undefined = [];
    const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id: teacher_ids,
        organization_id,
      },
    });
    let classListall = result.user?.membership?.classesTeaching;
    if (school_id && school_id !== "all" && school_id !== "no_assigned") {
      classListall = classListall?.filter((classItem) => classItem?.schools?.some((school) => school?.school_id === school_id));
    }
    if (school_id === "no_assigned") {
      classListall = classListall?.filter((classItem) => classItem?.schools?.length === 0);
    }
    classList = classList?.concat(
      classListall?.filter((classItem) => classItem?.status === Status.Active) as Pick<Class, "class_id" | "class_name">[]
    );
    return { classList };
  }
);

const { actions, reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {
    resetSummaryOptions: (state, { payload }: PayloadAction<TimeFilter>) => {
      state.summaryReportOptions.year = payload.year ? payload.year : state.summaryReportOptions.year;
      state.summaryReportOptions.week_start = payload.week_start;
      state.summaryReportOptions.week_end = payload.week_end;
      state.summaryReportOptions.years = payload.years ? payload.years : state.summaryReportOptions.years;
      state.summaryReportOptions.weeks = payload.weeks ? payload.weeks : state.summaryReportOptions.weeks;
      state.summaryReportOptions.schools = [];
      state.summaryReportOptions.school_id = payload.school_id ? payload.school_id : "";
      state.summaryReportOptions.classes = [];
      state.summaryReportOptions.class_id = "";
      state.summaryReportOptions.teachers = [];
      state.summaryReportOptions.teacher_id = "";
      state.summaryReportOptions.students = [];
      state.summaryReportOptions.student_id = "";
      state.summaryReportOptions.subjects = [];
      state.summaryReportOptions.subject_id = "";
    },
  },
  extraReducers: {
    [getAchievementList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAchievementList>>) => {
      state.reportList = payload.items;
    },
    [getAchievementList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementList.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.reportList = initialState.reportList;
    },

    [getClassList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassList>>) => {
      state.reportMockOptions.classList = (payload.user && payload.user.membership?.classesTeaching
        ? payload.user.membership?.classesTeaching
        : undefined) as Pick<Class, "class_id" | "class_name">[];

      state.reportMockOptions.class_id = (payload.user && payload.user.membership?.classesTeaching
        ? payload.user.membership?.classesTeaching[0]?.class_id
        : undefined) as string;
    },
    [getClassList.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getLessonPlan.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
      state.reportMockOptions.lessonPlanList = payload;
      state.reportMockOptions.lesson_plan_id = payload[0] && (payload[0].id || "");
      state.stuReportMockOptions.lessonPlanList = payload;
    },
    [getLessonPlan.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAchievementDetail>>) => {
      state.achievementDetail = payload.categories;
      state.student_name = payload.student_name;
    },
    [getAchievementDetail.rejected.type]: (state, { error }: any) => {
      // alert(JSON.stringify(error));
    },
    [getAchievementDetail.pending.type]: (state, { payload }: PayloadAction<any>) => {
      // alert("success");
      state.achievementDetail = initialState.achievementDetail;
    },

    [reportOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportOnload>>) => {
      const { reportList, ...reportMockOptions } = payload;
      state.reportMockOptions = { ...reportMockOptions };
      state.reportList = reportList;
    },
    [reportOnload.pending.type]: (state) => {
      state.reportMockOptions = cloneDeep(initialState.reportMockOptions);
    },

    [getTeacherListByOrgId.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeacherListByOrgId>>) => {
      const { teacherList } = payload;
      state.reportMockOptions.teacherList = teacherList;
      state.reportMockOptions.teacher_id = teacherList[0] && teacherList[0].user_id;
    },
    [getTeacherListByOrgId.pending.type]: (state) => {
      state.reportMockOptions.teacherList = cloneDeep(initialState.reportMockOptions.teacherList);
      state.reportMockOptions.teacher_id = cloneDeep(initialState.reportMockOptions.teacher_id);
    },

    [reportCategoriesOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof reportCategoriesOnload>>) => {
      state.categoriesPage = payload;
    },
    [reportCategoriesOnload.pending.type]: (state) => {
      state.categoriesPage = cloneDeep(initialState.categoriesPage);
    },
    [teachingLoadOnload.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof teachingLoadOnload>>) => {
      state.teachingLoadOnload = payload;
    },
    [teachingLoadOnload.pending.type]: (state) => {
      state.teachingLoadOnload = initialState.teachingLoadOnload;
    },
    [getTeachingLoadList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTeachingLoadList>>) => {
      state.teachingLoadOnload.teachingLoadList = payload;
    },
    [getClassListByschool.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassListByschool>>) => {
      state.teachingLoadOnload.classList = payload.classList;
    },
    [getClassListByschool.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassListByschool>>) => {
      state.teachingLoadOnload.classList = initialState.teachingLoadOnload.classList;
      state.teachingLoadOnload.teachingLoadList = initialState.teachingLoadOnload.teachingLoadList;
    },
    [resetReportMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof resetReportMockOptions>>) => {
      state.reportMockOptions = initialState.reportMockOptions;
      state.summaryReportOptions = initialState.summaryReportOptions;
    },
    [onLoadLearningSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadLearningSummary>>) => {
      state.summaryReportOptions = payload;
    },
    [getLiveClassesSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLiveClassesSummary>>) => {
      state.liveClassSummary = payload;
    },
    [getAssignmentSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssignmentSummary>>) => {
      state.assignmentSummary = payload;
    },
    [getTimeFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getTimeFilter>>) => {
      const years = payload.map((item) => item.year as number);
      state.summaryReportOptions.years = years;
      const weeks = payload[0].weeks
        ? payload[0].weeks?.map((item) => {
            const week_start = item.week_start as number;
            const week_end = item.week_end as number;
            return {
              week_start,
              week_end,
              value: `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end)}`,
            };
          })
        : [];
      state.summaryReportOptions.weeks = weeks;
      const _week = weeks[weeks.length - 1];
      state.summaryReportOptions.year = years[years.length - 1];
      state.summaryReportOptions.week_end = _week.week_end;
      state.summaryReportOptions.week_start = _week.week_start;
    },
    [getRemainFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getRemainFilter>>) => {},
    [getAfterClassFilter.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAfterClassFilter>>) => {
      if (payload.filter_type === "class") {
        state.summaryReportOptions.school_id = payload.school_id;
        state.summaryReportOptions.class_id = payload.class_id;
        state.summaryReportOptions.teacher_id = payload.teacher_id;
        state.summaryReportOptions.student_id = payload.student_id;
      } else 
      if(payload.filter_type === "teacher" || payload.filter_type === "student") {
        state.summaryReportOptions.class_id = payload.class_id;
        state.summaryReportOptions.teacher_id = payload.teacher_id;
        state.summaryReportOptions.student_id = payload.student_id;
        state.summaryReportOptions.student_id = payload.student_id;
      } else {
        state.summaryReportOptions.student_id = payload.student_id;
        state.summaryReportOptions.student_id = payload.student_id;
      }
      if (payload.classes) {
        state.summaryReportOptions.classes = payload.classes;
      }
      if (payload.teachers) {
        state.summaryReportOptions.teachers = payload.teachers;
      }
      if (payload.students) {
        state.summaryReportOptions.students = payload.students;
      }
      if (payload.subjects) {
        state.summaryReportOptions.subjects = payload.subjects;
        state.summaryReportOptions.subject_id = payload.subject_id;
      }
      if (!payload.student_id){
        payload.summary_type === ReportType.live
        ?
        state.liveClassSummary = {}
        :
        state.assignmentSummary = {}
      }
    },
  },
});
export const { resetSummaryOptions } = actions;
export default reducer;

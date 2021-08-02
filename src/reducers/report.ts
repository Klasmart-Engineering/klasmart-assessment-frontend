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
  MySchoolIDsDocument,
  MySchoolIDsQuery,
  MySchoolIDsQueryVariables,
  NotParticipantsByOrganizationDocument,
  NotParticipantsByOrganizationQuery,
  NotParticipantsByOrganizationQueryVariables,
  ParticipantsByClassDocument,
  ParticipantsByClassQuery,
  ParticipantsByClassQueryVariables,
  ParticipantsByOrganizationDocument,
  ParticipantsByOrganizationQuery,
  ParticipantsByOrganizationQueryVariables,
  ParticipantsBySchoolDocument,
  ParticipantsBySchoolQuery,
  ParticipantsBySchoolQueryVariables,
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
  EntityTeacherReportCategory,
  ExternalSubject,
} from "../api/api.auto";
import { apiGetPermission, apiWaitForOrganizationOfPage } from "../api/extra";
import { hasPermissionOfMe, PermissionType } from "../components/Permission";
import { deDuplicate, ModelReport } from "../models/ModelReports";
import { ReportFilter, ReportOrderBy } from "../pages/ReportAchievementList/types";
import { getWeeks, IWeeks } from "../pages/ReportLearningSummary";
import { LearningSummartOptionsProps } from "../pages/ReportLearningSummary/FilterLearningSummary";
import { QueryLearningSummaryCondition } from "../pages/ReportLearningSummary/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad } from "./schedule";
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
  learningSummartOptions: LearningSummartOptionsProps;
  liveClassSummary: EntityQueryLiveClassesSummaryResult;
  assignmentSummary: EntityQueryAssignmentsSummaryResult;
}
interface RootState {
  report: IreportState;
}
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
  learningSummartOptions: {
    year: [],
    week: [],
    // schoolList: [],
    // classList: [],
    // teacherList: [],
    studentList: [],
    subjectList: [],
  },
  liveClassSummary: {
    // attend: 0,
    // items: [
    //   {
    //     absent: false,
    //     assessment_id: "111",
    //     class_start_time: 1623979200,
    //     complete_at: 1623979200,
    //     create_at: 1623979200,
    //     lesson_plan_name: "lesson plan name 1",
    //     outcomes: [],
    //     schedule_id: "schedule111",
    //     schedule_title: "scheduletitle 111",
    //     teacher_feedback: "teacher feedback 111",
    //   },
    //   {
    //     absent: true,
    //     assessment_id: "222",
    //     class_start_time: 1624001400,
    //     complete_at: 1624001400,
    //     create_at: 1624001400,
    //     lesson_plan_name: "lesson plan name 2",
    //     outcomes: [
    //       {
    //         id: "outcome 111",
    //         name: "outcome 111",
    //       },
    //       {
    //         id: "outcome 222",
    //         name: "outcome 222",
    //       },
    //     ],
    //     schedule_id: "schedule222",
    //     schedule_title: "scheduletitle 222",
    //     teacher_feedback: "teacher feedback 222",
    //   },
    //   {
    //     absent: true,
    //     assessment_id: "333",
    //     class_start_time: 1623897600,
    //     complete_at: 1623897600,
    //     create_at: 1623897600,
    //     lesson_plan_name: "lesson plan name 1",
    //     outcomes: [],
    //     schedule_id: "schedule333",
    //     schedule_title: "scheduletitle 333",
    //     teacher_feedback: "teacher feedback 333",
    //   },
    //   {
    //     absent: false,
    //     assessment_id: "444",
    //     class_start_time: 1623828600,
    //     complete_at: 1623828600,
    //     create_at: 1623828600,
    //     lesson_plan_name: "lesson plan name 1",
    //     outcomes: [
    //       {
    //         id: "outcome 333",
    //         name: "outcome 333",
    //       },
    //       {
    //         id: "outcome 444",
    //         name: "outcome 444",
    //       },
    //     ],
    //     schedule_id: "schedule444",
    //     schedule_title: "scheduletitle 444",
    //     teacher_feedback: "teacher feedback 444",
    //   },
    // ],
  },
  assignmentSummary: {
    // home_fun_study_count: 2,
    // study_count: 4,
    // items: [
    //   {
    //     assessment_id: "assessment id 111",
    //     assessment_title: "assessment title 111",
    //     assessment_type: "study",
    //     complete_at: 1623979200,
    //     create_at: 1623979200,
    //     lesson_plan_name: "lesson plan name 111",
    //     outcomes: [{ id: "outcome id 1", name: "outcome name 1" }],
    //     schedule_id: "schedule id 111",
    //     status: "complete",
    //     teacher_feedback: "teacher feedback 111",
    //   },
    //   {
    //     assessment_id: "assessment id 222",
    //     assessment_title: "assessment title 222",
    //     assessment_type: "home_fun_study",
    //     complete_at: 1623979200,
    //     create_at: 1623979200,
    //     lesson_plan_name: "lesson plan name 222",
    //     outcomes: [{ id: "outcome id 2", name: "outcome name 2" }],
    //     schedule_id: "schedule id 222",
    //     teacher_feedback: "teacher feedback 222",
    //   },
    // ],
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

// interface GetStuReportListResponse {
//   stuReportList?: EntityStudentPerformanceReportItem[];
//   h5pReportList?: EntityStudentsPerformanceH5PReportItem[];
// }
// interface GetStuReportListPayload {
//   teacher_id: string;
//   class_id: string;
//   lesson_plan_id: string;
// }
// export const getStuReportList = createAsyncThunk<GetStuReportListResponse, GetStuReportListPayload & LoadingMetaPayload>(
//   "getStuReportList",
//   async ({ teacher_id, class_id, lesson_plan_id }) => {
//     const stuItems = await api.reports.listStudentsPerformanceReport({ teacher_id, class_id, lesson_plan_id });
//     const h5pItems = await api.reports.listStudentsPerformanceH5PReport({ teacher_id, class_id, lesson_plan_id });
//     return { stuReportList: stuItems.items, h5pReportList: h5pItems.items };
//   }
// );

// interface GetStuReportDetailResponse {
//   stuReportDetail?: EntityStudentPerformanceReportItem[];
//   h5pReportDetail?: EntityStudentPerformanceH5PReportItem[];
// }
// interface GetStuReportDetailPayload {
//   teacher_id: string;
//   class_id: string;
//   lesson_plan_id: string;
//   id: string;
// }
// export const getStuReportDetail = createAsyncThunk<GetStuReportDetailResponse, GetStuReportDetailPayload & LoadingMetaPayload>(
//   "getStuReportDetail",
//   async ({ teacher_id, class_id, lesson_plan_id, id }) => {
//     const stuItems = await api.reports.getStudentPerformanceReport(id, { teacher_id, class_id, lesson_plan_id });
//     const h5pItems = await api.reports.getStudentPerformanceH5PReport(id, { teacher_id, class_id, lesson_plan_id });
//     return { stuReportDetail: stuItems.items, h5pReportDetail: h5pItems.items };
//   }
// );

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
// interface GetStuReportMockOptionsPayLoad {
//   teacher_id?: string;
//   class_id?: string;
//   lesson_plan_id?: string;
//   view_my_report?: boolean;
//   status?: ReportFilter;
//   sort_by?: ReportOrderBy;
//   student_id: string;
// }

// export const stuPerformanceReportOnload = createAsyncThunk<
//   GetStuReportMockOptionsResponse,
//   GetStuReportMockOptionsPayLoad & LoadingMetaPayload
// >("stuPerformanceReportOnload", async ({ teacher_id, class_id, lesson_plan_id, student_id }) => {
//   const organization_id = (await apiWaitForOrganizationOfPage()) as string;
//   let reportList: EntityStudentAchievementReportItem[] = [];
//   let lessonPlanList: EntityScheduleShortInfo[] = [];
//   let teacherList: Pick<User, "user_id" | "user_name">[] | undefined = [];
//   let finalTearchId: string = "";
//   let studentList: Pick<User, "user_id" | "user_name">[] | undefined = [];
//   let h5pReportList: EntityStudentsPerformanceH5PReportItem[] = [];
//   let stuReportList: EntityStudentPerformanceReportItem[] = [];
//   let stuReportDetail: EntityStudentPerformanceReportItem[] = [];
//   let h5pReportDetail: EntityStudentPerformanceH5PReportItem[] = [];
//   // 拉取我的user_id
//   const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
//     query: QeuryMeDocument,
//     variables: {
//       organization_id,
//     },
//   });
//   const myTearchId = meInfo.me?.user_id || "";
//   const meInfoPerm = await apiGetPermission();
//   const perm = hasPermissionOfMe(
//     [
//       PermissionType.view_my_reports_614,
//       PermissionType.view_reports_610,
//       PermissionType.view_my_organizations_reports_612,
//       PermissionType.view_my_school_reports_611,
//     ],
//     meInfoPerm.me
//   );
//   if (perm.view_my_reports_614 && !perm.view_reports_610 && !perm.view_my_school_reports_611 && !perm.view_my_organizations_reports_612) {
//     teacherList = [];
//     finalTearchId = myTearchId;
//   } else {
//     if (perm.view_my_organizations_reports_612 || perm.view_reports_610) {
//       const { data } = await gqlapi.query<TeacherByOrgIdQuery, TeacherByOrgIdQueryVariables>({
//         query: TeacherByOrgIdDocument,
//         variables: {
//           organization_id,
//         },
//       });
//       data.organization?.classes?.forEach((classItem) => {
//         teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]);
//       });
//     }
//     if (perm.view_my_school_reports_611 || perm.view_reports_610) {
//       const { data } = await gqlapi.query<GetSchoolTeacherQuery, GetSchoolTeacherQueryVariables>({
//         query: GetSchoolTeacherDocument,
//         variables: {
//           user_id: myTearchId,
//         },
//       });
//       data.user?.school_memberships
//         ?.filter((schoolItem) => schoolItem?.school?.organization?.organization_id === organization_id)
//         .map((schoolItem) =>
//           schoolItem?.school?.classes?.forEach(
//             (classItem) => (teacherList = teacherList?.concat(classItem?.teachers as Pick<User, "user_id" | "user_name">[]))
//           )
//         );
//     }
//     teacherList = ModelReport.teacherListSetDiff(teacherList);
//     finalTearchId = teacher_id || (teacherList && teacherList[0]?.user_id) || "";
//     if (!teacherList || !teacherList[0])
//       return {
//         teacherList: [],
//         classList: [],
//         lessonPlanList: [],
//         teacher_id: "",
//         class_id: "",
//         lesson_plan_id: "",
//         student_id,
//       };
//   }
//   const { data: result } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
//     query: ClassesTeachingQueryDocument,
//     variables: {
//       user_id: finalTearchId,
//       organization_id,
//     },
//   });
//   // const mockClassResult: ClassesByTeacherQuery = classListByTeacher;
//   const classList = result.user && (result.user.membership?.classesTeaching as Pick<Class, "class_id" | "class_name">[]);
//   const firstClassId = classList && classList[0]?.class_id;
//   const finalClassId = class_id ? class_id : firstClassId;
//   //获取plan_id
//   if (finalTearchId && finalClassId) {
//     const data = await api.schedulesLessonPlans.getLessonPlans({
//       teacher_id: (finalTearchId as string) || "",
//       class_id: (finalClassId as string) || "",
//     });
//     lessonPlanList = data || [];
//   }
//   const finalPlanId = lesson_plan_id ? lesson_plan_id : lessonPlanList[0]?.id || "";
//   // 用finalClassId 拉取studetlist
//   if (finalTearchId && finalClassId) {
//     const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
//       query: ParticipantsByClassDocument,
//       variables: { class_id: finalClassId },
//     });
//     studentList = studentList.concat(data.class?.students as Pick<User, "user_id" | "user_name">[]) || [];
//   }
//   const finalStudentId = student_id ? student_id : ALL_STUDENT;
//   if (finalPlanId) {
//     if (finalStudentId === ALL_STUDENT) {
//       const stuItems = await api.reports.listStudentsPerformanceReport({
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       stuReportList = stuItems.items || [];
//       // stuReportList = stuPerformaceList;
//       const h5pItems = await api.reports.listStudentsPerformanceH5PReport({
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       h5pReportList = h5pItems.items || [];
//       // h5pReportList = stuPerformanceH5pList;
//     } else {
//       const stuItems = await api.reports.getStudentPerformanceReport(student_id, {
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       stuReportDetail = stuItems.items || [];
//       // stuReportDetail = stuPerformanceDetail;
//       const h5pItems = await api.reports.getStudentPerformanceH5PReport(student_id, {
//         teacher_id: finalTearchId,
//         class_id: finalClassId || "",
//         lesson_plan_id: finalPlanId as string,
//       });
//       h5pReportDetail = h5pItems.items || [];
//       // h5pReportDetail = stuPerformanceH5pDetail;
//     }
//   }

//   return {
//     teacherList,
//     classList: classList || [],
//     lessonPlanList: lessonPlanList,
//     teacher_id: finalTearchId,
//     class_id: finalClassId || "",
//     lesson_plan_id: finalPlanId || "",
//     student_id: finalStudentId,
//     reportList,
//     studentList,
//     h5pReportList,
//     stuReportList,
//     h5pReportDetail,
//     stuReportDetail,
//   };
// });

type IQueryGetStudentsByClassIdParams = {
  class_id: string;
};
export const getScheduleParticipant = createAsyncThunk<getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad>(
  "getParticipant",
  async ({ class_id }) => {
    const { data } = await gqlapi.query<ParticipantsByClassQuery, ParticipantsByClassQueryVariables>({
      query: ParticipantsByClassDocument,
      variables: { class_id },
    });
    const participantList = data;
    return { participantList };
  }
);
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
    const res = await api.reports.queryLiveClassesSummary({ ...query });
    return res;
  }
);

export type IParamsQueryAssignmentSummary = Parameters<typeof api.reports.queryAssignmentsSummary>[0];
export type IResultQueryAssignmentSummary = AsyncReturnType<typeof api.reports.queryAssignmentsSummary>;
export const getAssignmentSummary = createAsyncThunk<IResultQueryAssignmentSummary, IParamsQueryAssignmentSummary & LoadingMetaPayload>(
  "getAssingmentSummary",
  async (query) => {
    const res = await api.reports.queryAssignmentsSummary({ ...query });
    return res;
  }
);

export interface LearningSummaryResponse {
  year?: number[];
  week?: IWeeks[];
  studentList?: Pick<User, "user_id" | "user_name">[];
  subjectList?: ExternalSubject[];
}

export const onLoadLearningSummary = createAsyncThunk<
  LearningSummaryResponse,
  QueryLearningSummaryCondition & LoadingMetaPayload,
  { state: RootState }
>("onLoadLearningSummary", async (query, { getState, dispatch }) => {
  let studentList: Pick<User, "user_id" | "user_name">[] | undefined = [];
  // let liveClassSummary: EntityQueryLiveClassesSummaryResult[] =[];
  const {
    report: { learningSummartOptions },
  } = getState();
  if (learningSummartOptions.week.length) {
    const { subject_id, student_id } = query;
    if (student_id) {
      if (subject_id === "all") {
        await dispatch(getLiveClassesSummary({ ...query, subject_id: "" }));
        await dispatch(getAssignmentSummary({ ...query, subject_id: "" }));
      } else {
        await dispatch(getLiveClassesSummary({ ...query }));
        await dispatch(getAssignmentSummary({ ...query }));
      }
    }
    return learningSummartOptions;
  }
  const week = getWeeks();
  const organization_id = (await apiWaitForOrganizationOfPage()) as string;
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  const perm = hasPermissionOfMe(
    [
      PermissionType.report_learning_summary_org_652,
      PermissionType.report_learning_summary_school_651,
      PermissionType.report_learning_summary_teacher_650,
      PermissionType.report_learning_summary_student_649,
    ],
    meInfo.me
  );
  if (perm.report_learning_summary_org_652) {
    // todo 拉取所有选项并且 默认置位第一个
    // 通过org拉取student 可以看到 year week school teacher class student subject
    const { data } = await gqlapi.query<ParticipantsByOrganizationQuery, ParticipantsByOrganizationQueryVariables>({
      query: ParticipantsByOrganizationDocument,
      variables: {
        organization_id,
      },
    });
    data.organization?.classes?.forEach((classItem) => {
      studentList = studentList?.concat(classItem?.students as Pick<User, "user_id" | "user_name">[]);
    });
  } else if (perm.report_learning_summary_school_651) {
    // 通过school拉取student 可以看到 year week teacher class student subject
    const { data: schoolInfo } = await gqlapi.query<MySchoolIDsQuery, MySchoolIDsQueryVariables>({
      query: MySchoolIDsDocument,
      variables: { organization_id },
    });
    if (schoolInfo.me?.membership?.schoolMemberships![0]?.school_id) {
      const { data } = await gqlapi.query<ParticipantsBySchoolQuery, ParticipantsBySchoolQueryVariables>({
        query: ParticipantsBySchoolDocument,
        variables: {
          school_id: schoolInfo.me?.membership?.schoolMemberships![0]?.school_id as string,
        },
      });
      data.school?.classes?.forEach((classItem) => {
        studentList = studentList?.concat(classItem?.students as Pick<User, "user_id" | "user_name">[]);
      });
    }
  } else if (perm.report_learning_summary_teacher_650) {
    // 通过classteaching拉取student 可以看到 year week class student subject
    const { data } = await gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
      query: ClassesTeachingQueryDocument,
      variables: {
        user_id: meInfo.me?.user_id as string,
        organization_id,
      },
    });
    data.user?.membership?.classesTeaching?.forEach((item) => {
      studentList = studentList?.concat(item?.students as Pick<User, "user_id" | "user_name">[]);
    });
  } else if (perm.report_learning_summary_student_649) {
    // 不需要拉取student 可以看到 year week  subject
  }
  studentList = studentList.map((item) => {
    return {
      user_id: item.user_id,
      user_name: item.user_name,
    };
  });
  const subjectList: ExternalSubject[] = await api.subjects.getSubject();
  return {
    studentList: deDuplicate(studentList),
    subjectList,
    year: [2021],
    week,
  };
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

const { reducer } = createSlice({
  name: "report ",
  initialState,
  reducers: {},
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
    // [getLessonPlan.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLessonPlan>>) => {
    //   state.reportMockOptions.lessonPlanList = payload;
    //   state.reportMockOptions.lesson_plan_id = payload[0] && (payload[0].id || "");
    //   state.stuReportMockOptions.lessonPlanList = payload;
    // },
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
    // [stuPerformanceReportOnload.fulfilled.type]: (
    //   state,
    //   { payload }: PayloadAction<AsyncTrunkReturned<typeof stuPerformanceReportOnload>>
    // ) => {
    //   const { h5pReportList, stuReportList, h5pReportDetail, stuReportDetail, ...stuReportMockOptions } = payload;
    //   state.stuReportMockOptions = { ...stuReportMockOptions };
    //   state.h5pReportList = h5pReportList;
    //   state.stuReportList = stuReportList;
    //   state.h5pReportDetail = h5pReportDetail;
    //   state.stuReportDetail = stuReportDetail;
    // },
    // [stuPerformanceReportOnload.pending.type]: (state) => {
    //   state.stuReportMockOptions = cloneDeep(initialState.stuReportMockOptions);
    //   state.h5pReportList = cloneDeep(initialState.h5pReportList);
    //   state.stuReportList = cloneDeep(initialState.stuReportList);
    //   state.h5pReportDetail = cloneDeep(initialState.h5pReportDetail);
    //   state.stuReportDetail = cloneDeep(initialState.stuReportDetail);
    // },
    // [getStuReportList.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStuReportList>>) => {
    //   state.stuReportList = payload.stuReportList;
    //   state.h5pReportList = payload.h5pReportList;
    // },
    // [getStuReportList.rejected.type]: (state, { error }: any) => {
    //   // alert(JSON.stringify(error));
    // },
    // [getStuReportList.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   // alert("success");
    //   state.stuReportList = initialState.stuReportList;
    //   state.h5pReportList = initialState.h5pReportList;
    // },
    // [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
    //   state.stuReportMockOptions.studentList = payload.participantList.class?.students as Pick<User, "user_id" | "user_name">[];
    // },
    // [getStuReportDetail.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getStuReportDetail>>) => {
    //   state.stuReportDetail = payload.stuReportDetail;
    //   state.h5pReportDetail = payload.h5pReportDetail;
    // },
    // [getStuReportDetail.pending.type]: (state, { payload }: PayloadAction<any>) => {
    //   // alert("success");
    //   state.stuReportDetail = initialState.stuReportDetail;
    //   state.h5pReportDetail = initialState.h5pReportDetail;
    // },
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
    },
    [onLoadLearningSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof onLoadLearningSummary>>) => {
      if (payload.studentList) {
        state.learningSummartOptions.studentList = payload.studentList || [];
        state.learningSummartOptions.subjectList = payload.subjectList || [];
        state.learningSummartOptions.year = payload.year || [];
        state.learningSummartOptions.week = payload.week || [];
      }
    },
    [getLiveClassesSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getLiveClassesSummary>>) => {
      state.liveClassSummary = payload;
    },
    [getAssignmentSummary.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssignmentSummary>>) => {
      state.assignmentSummary = payload;
    },
  },
});
export default reducer;

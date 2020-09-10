import { cloneDeep } from "lodash";
import { GetAssessmentResult, UpdateAssessmentRequestData } from "../api/type";

interface ObjContainId {
  id?: string;
}
function toHash<T extends ObjContainId>(arr: T[]): Record<string, T> {
  return arr.reduce<Record<string, T>>((result, item) => {
    if (!item.id) return result;
    result[item.id] = item;
    return result;
  }, {});
}

export const ModelAssessment = {
  toRequest(detail: GetAssessmentResult): UpdateAssessmentRequestData {
    const draft = cloneDeep(detail);
    const attendance_ids = draft.attendances?.map((attendance) => attendance.id as string) || [];
    const outcome_attendance_maps = draft.outcome_attendance_maps || [];
    return { attendance_ids, outcome_attendance_maps };

    // return produce(detail, draft => {
    //   const attendance_ids = detail.attendances?.map(attendance => attendance.id as string) || [];
    //   const outcome_attendance_maps = detail.outcome_attendance_maps || [];
    //   return { attendance_ids, outcome_attendance_maps };
    // });
  },

  toDetail(defaultDetail: GetAssessmentResult, value: UpdateAssessmentRequestData): GetAssessmentResult {
    const draft = cloneDeep(defaultDetail);
    const attendanceHash = toHash(defaultDetail.attendances || []);
    draft.attendances = value.attendance_ids?.map((id) => attendanceHash[id]) || [];
    return draft;

    // return produce(defaultDetail, draft => {
    //   const attendanceHash = toHash(defaultDetail.attendances || []);
    //   draft.attendances = value.attendance_ids?.map(id => attendanceHash[id]) || [];
    // });
  },
};

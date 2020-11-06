export enum PermissionType {
  create_content_page_201 = "create_content_page_201",
  unpublished_content_page_202 = "unpublished_content_page_202",
  pending_content_page_203 = "pending_content_page_203",
  published_content_page_204 = "published_content_page_204",
  archived_content_page_205 = "archived_content_page_205",
  create_lesson_material_220 = "create_lesson_material_220",
  create_lesson_plan_221 = "create_lesson_plan_221",
  edit_org_published_content_235 = "edit_org_published_content_235",
  edit_lesson_material_metadata_and_content_236 = "edit_lesson_material_metadata_and_content_236",
  edit_lesson_plan_metadata_237 = "edit_lesson_plan_metadata_237",
  edit_lesson_plan_content_238 = "edit_lesson_plan_content_238",
  approve_pending_content_271 = "approve_pending_content_271",
  reject_pending_content_272 = "reject_pending_content_272",
  archive_published_content_273 = "archive_published_content_273",
  republish_archived_content_274 = "republish_archived_content_274",
  delete_archived_content_275 = "delete_archived_content_275",
  associate_learning_outcomes_284 = "associate_learning_outcomes_284",
  create_asset_page_301 = "create_asset_page_301",
  create_asset_320 = "create_asset_320",
  delete_asset_340 = "delete_asset_340",
  attend_live_class_as_a_student_187 = "attend_live_class_as_a_student_187",
  attend_live_class_as_a_teacher_186 = "attend_live_class_as_a_teacher_186",
  schedule_500 = "schedule_500",
  create_schedule_paage_501 = "create_schedule_paage_501",
  view_my_calendar_510 = "view_my_calendar_510",
  view_org_calendar__511 = "view_org_calendar__511",
  create_event__520 = "create_event__520",
  edit_event__530 = "edit_event__530",
  delete_event_540 = "delete_event_540",
}

export interface PermissionProps {
  value: PermissionType;
}

export function Permission(props: PermissionProps) {
  return null;
}
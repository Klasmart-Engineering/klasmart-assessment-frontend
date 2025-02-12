export type AssesmentPopType = "ViewComment" | "AddComment" | "DetailView" | "Notice" | "";

export interface ElasticLayerControl {
  openStatus: boolean;
  link?: string;
  type: AssesmentPopType;
  handleChangeComment?: (commentText: string) => void;
  contentText?: string;
  title?: string;
}

export type dynamicTableName = "student_view_items";

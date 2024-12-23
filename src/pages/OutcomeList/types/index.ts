import { AsyncReturnType } from "@reducers/type";
import api from "../../../api";

type NonOnlyNull<T> = T extends null ? never : T;
type NonNullRecordValue<T> = {
  [K in keyof T]: NonOnlyNull<T[K]>;
};

export type OutcomeQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0]>> & {
  is_unpub?: string;
  exect_search?: string;
};
export type OutcomeQueryConditionChangeHandler = (value: OutcomeQueryCondition) => any;
export type OutcomeQueryConditionBaseProps = {
  onChange: OutcomeQueryConditionChangeHandler;
  value: OutcomeQueryCondition;
};

export type AssesmentQueryCondition = NonNullRecordValue<NonNullable<Parameters<typeof api.assessments.listAssessment>[0]>>;
export type AssesmentQueryConditionChangeHandler = (value: AssesmentQueryCondition) => any;
export type AssesmentQueryConditionBaseProps = {
  onChange: AssesmentQueryConditionChangeHandler;
  value: AssesmentQueryCondition;
};

export enum BulkListFormKey {
  CHECKED_BULK_IDS = "CHECKED_BULK_IDS",
  SEARCH_TEXT_KEY = "SEARCH_TEXT_KEY",
  EXECT_SEARCH = "EXECT_SEARCH",
}

export type GetOutcomeIDList = NonNullRecordValue<NonNullable<Parameters<typeof api.bulk.deleteOutcomeBulk>[0]>>;
export interface BulkListForm {
  [BulkListFormKey.CHECKED_BULK_IDS]: NonNullRecordValue<NonNullable<GetOutcomeIDList["outcome_ids"]>>;
  [BulkListFormKey.SEARCH_TEXT_KEY]: string;
  [BulkListFormKey.EXECT_SEARCH]: string;
}

export type DownloadOutcomeListResult = NonNullable<AsyncReturnType<typeof api.learningOutcomes.exportLearningOutcomes>["data"]>
export type DownloadOutcomeItemResult = NonNullable<DownloadOutcomeListResult>[0];

export enum HeaderCategory {
  assessment = "assessments",
  outcome = "outcome",
  milestones = "milestones",
  standards = "standards",
}

export enum OutcomeListExectSearch {
  all = "search_key",
  loName = "outcome_name",
  shortCode = "shortcode",
  author = "author_name",
  loSet = "set_name",
  keyWord = "keywords",
  description = "description",
}

export interface DownLoadOutcomeTitleProps {
  outcome_name: string;
  shortcode: string;
  assumed: string;
  score_threshold: string;
  created_at: string;
  author_name: string;
  program: string;
  subject: string;
  developmental: string;
  skills: string;
  age: string,
  grade: string,
  sets: string,
  keywords: string,
  milestones: string,
  description: string
}

export interface FieldsProps {
  label: string;
  value: string;
  checked: boolean;
  readonly: boolean;
}

export interface BaseInfoProps {
  id?: string;
  name?: string;
  status?: string;
  system?: boolean;
}
export interface ProgramsObjProps extends BaseInfoProps {
  // subjects?: BaseInfoProps[];
  ages: BaseInfoProps[];
  grades: BaseInfoProps[];
}

export const LoKeys = [
  "outcome_name", 
  "shortcode", 
  "assumed", 
  "score_threshold", 
  "program", 
  "subject", 
  "category", 
  "subcategory", 
  "sets", 
  "age", 
  "grade", 
  "keywords", 
  "description", 
  "author", 
  "updated_at", 
  "milestones"
]

export interface CustomOutcomeItemProps {
  id?: string;
  value?: string;
  error?: string;
}
export interface CustomOutcomeItemArrayProps {
  error?: string;
  items?: CustomOutcomeItemProps[];
}
export interface ShortcodeProps{
  value?: string;
  errors?: string[];
}
export interface CustomOutcomeProps {
  row_number: number;
  outcome_name: CustomOutcomeItemProps;
  shortcode: ShortcodeProps;
  assumed: CustomOutcomeItemProps;
  score_threshold: CustomOutcomeItemProps;
  program: CustomOutcomeItemProps;
  subject: CustomOutcomeItemArrayProps;
  category: CustomOutcomeItemProps;
  subcategory: CustomOutcomeItemArrayProps;
  sets: CustomOutcomeItemProps[];
  age: CustomOutcomeItemArrayProps;
  grade: CustomOutcomeItemArrayProps;
  keywords: CustomOutcomeItemProps[];
  description: CustomOutcomeItemProps;
  author: string;
  updated_at: string;
  milestones: string[];
}


export interface CategoryObjProps extends BaseInfoProps {
  subCategory: BaseInfoProps[]
}
export interface SubjectObjProps {
  id?: string;
  name?: string;
  category?: CategoryObjProps[];
}

export interface OutcomeFromCSVFirstProps {
  row_number: number;
  outcome_name?: string;
  shortcode?: string;
  assumed?: string;
  score_threshold?: string;
  program?: string;
  subject?: string[];
  category?: string;
  subcategory?: string[];
  sets?: string[];
  age?: string[];
  grade?: string[];
  keywords?: string[];
  description?: string;
  author?: string;
  updated_at?: string;
  milestones?: string[];
}

export enum UploadTab {
  create = "create",
  modify = "modify"
}
export interface UploadLoItemProps {
  value?: string;
  error?: string;
}

export interface OutcomeHeadersProps {
  key: string;
  title: string;
}

export interface ErrorsInfoProps {
  errorCount: number, 
  errorRowsIndex: number[], 
  errorColumnsIndex: number[],
}

export interface AfterFeValidInfoProps {
  row_number: number;
  keywords?: UploadLoItemProps[];
  author?: string;
  updated_at?: string;
  shortcode?: string;
  sets?: UploadLoItemProps[];
  milestones?: UploadLoItemProps[];
  outcome_name?: UploadLoItemProps;
  assumed?: { 
    value?: boolean | string;
    error?: string;
  };
  score_threshold?: UploadLoItemProps;
  description?: UploadLoItemProps;
  program?: CustomOutcomeItemProps;
  subject?: CustomOutcomeItemArrayProps;
  category?: CustomOutcomeItemProps;
  subcategory?: CustomOutcomeItemArrayProps;
  age?: CustomOutcomeItemArrayProps;
  grade?: CustomOutcomeItemArrayProps;
}
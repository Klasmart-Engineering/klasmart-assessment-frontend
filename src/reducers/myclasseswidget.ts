import { GetClassesListDocument, GetClassesListQuery, GetClassesListQueryVariables } from "@api/api-ko.auto";
import { apiWaitForOrganizationOfPage } from "@api/extra";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { EntityReportClassWidgetResponse } from "@api/api.auto";
import { sortByClassName } from "@models/ModelClassWidget";
import { AsyncTrunkReturned } from "./type";

interface schoolItem {
  school_id?: string;
  school_name?: string;
}

interface classItem {
  class_id?: string;
  class_name?: string;
  schools?: schoolItem[];
}

export interface IAssessmentState {
  classList?: classItem[];
  classWidget?: EntityReportClassWidgetResponse;
}

const initialState: IAssessmentState = {
  classList: [],
  classWidget: {},
};

export const getClassesByOrg = createAsyncThunk("getClassesByOrg", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: dataInfo } = await gqlapi.query<GetClassesListQuery, GetClassesListQueryVariables>({
    query: GetClassesListDocument,
    variables: {
      organization_id,
    },
  });
  const classList: classItem[] | undefined = dataInfo.organization?.classes?.map((item) => ({
    class_id: item?.class_id,
    class_name: item?.class_name ? item?.class_name : "",
    schools: item?.schools
      ? item?.schools?.map((scItem) => ({
          school_id: scItem?.school_id ? scItem?.school_id : "",
          school_name: scItem?.school_name ? scItem?.school_name : "",
        }))
      : [],
  }));
  classList?.sort(sortByClassName("class_name"));
  return classList;
});

type ParamsGetClassWidget = Parameters<typeof api.reports.getClassWidget>[0] & LoadingMetaPayload;
export const getClassWidget = createAsyncThunk<EntityReportClassWidgetResponse, ParamsGetClassWidget>(
  "reports/class_widget",
  async (query) => {
    return api.reports.getClassWidget({ ...query });
  }
);
const { reducer } = createSlice({
  name: "myclasseswidget",
  initialState,
  reducers: {},
  extraReducers: {
    [getClassesByOrg.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassesByOrg>>) => {
      state.classList = payload;
    },
    [getClassWidget.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getClassWidget>>) => {
      state.classWidget = payload;
    },
  },
});

export default reducer;

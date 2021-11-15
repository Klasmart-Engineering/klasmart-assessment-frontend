import { configureStore } from "@reduxjs/toolkit";
import assessments from "./assessments";
import confirm from "./confirm";
import content from "./content";
import contentEdit from "./contentEdit";
import loading, { actSetLoading } from "./loading";
import { createLoadingMiddleware } from "./middleware/loadingMiddleware";
import milestone from "./milestone";
import notify from "./notify";
import outcome from "./outcome";
import report from "./report";
import schedule from "./schedule";

const loadingMiddleware = createLoadingMiddleware({
  enableLoadingPayload: { type: actSetLoading.type, payload: true },
  disableLoadingPayload: { type: actSetLoading.type, payload: false },
});

export const store = configureStore({
  reducer: {
    loading,
    confirm,
    notify,
    content,
    contentEdit,
    outcome,
    schedule,
    assessments,
    report,
    milestone,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loadingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

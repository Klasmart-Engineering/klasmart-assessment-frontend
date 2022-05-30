import { apiEmitter, ApiErrorEventData, ApiEvent, ApiInfoEventData, GraphQLErrorEventData } from "@api/emitter";
import { LangRecordId } from "@locale/lang/type";
import { t } from "@locale/LocaleManager";
import { setOrganizationId } from "@reducers/common";
import { store } from "@reducers/index";
import { actError, actInfo } from "@reducers/notify";
import React from "react";
import App from "./App";
import "./index.css";

apiEmitter.on<ApiErrorEventData>(ApiEvent.ResponseError, (e) => {
  if (!e) return;
  const { label, msg, data, onError } = e;
  // 韩国方面说： 他们会在容器外部处理未登录， 不需要通知
  // if (label === UNAUTHORIZED_LABEL) sendIframeMessage({ type: 'unauthorized', payload: null });
  const message = String(t(label as LangRecordId, data || undefined) || msg || "");
  if (message) onError ? onError(message) : store.dispatch(actError(message));
});

apiEmitter.on<ApiInfoEventData>(ApiEvent.Info, (e) => {
  if (!e) return;
  const { label } = e;
  const message = String(t(label as LangRecordId) || "");
  if (message) store.dispatch(actInfo(message));
});

apiEmitter.on<GraphQLErrorEventData>(ApiEvent.GraphQLError, (e) => {
  if (!e) return;
  const { label, msg } = e;
  const message = String(t(label as LangRecordId) || msg || "");
  if (message) store.dispatch(actError(message));
});

export default function Main(props: { organization_id?: string }) {
  // const locale = useGlobalStateValue(localeState);
  React.useEffect(() => {
    // if (locale) localeManager.toggle(shouldBeLangName(locale.slice(0, 2) || "en"));
    if (props.organization_id) store.dispatch(setOrganizationId(props.organization_id));
  }, [props]);
  return <App />;
}


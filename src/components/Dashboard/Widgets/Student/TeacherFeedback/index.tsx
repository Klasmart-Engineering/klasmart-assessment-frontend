import CssProvider from "@components/CssProvider";
import TeacherFeedbackWidget from "./TeacherFeedbackWidget";
// import {Context} from "../../../WidgetWrapper/widgetContext";

interface WidgetProps {
  widgetContext: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
  // widgetContext: Context;
}
export default function Index({ widgetContext }: WidgetProps) {
  return (
    <CssProvider>
      <TeacherFeedbackWidget widgetContext={widgetContext} />
    </CssProvider>
  );
}

import CssProvider from "@components/CssProvider";
import MyClassesWidget from "./MyClassesWidget";

interface WidgetProps {
  widgetContext: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
}
export default function Index({ widgetContext }: WidgetProps) {
  return (
    <CssProvider>
      <MyClassesWidget widgetContext={widgetContext} />
    </CssProvider>
  );
}

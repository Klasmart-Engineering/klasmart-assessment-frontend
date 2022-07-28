import CssProvider from "@components/CssProvider";
import MyClassWidget from "./MyClassWidget";

interface WidgetProps {
  widgetContext: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
}
export default function Index({ widgetContext }: WidgetProps) {
  return (
    <CssProvider>
      <MyClassWidget widgetContext={widgetContext} />
    </CssProvider>
  );
}

import CssProvider from "@components/CssProvider";
import MyClassesWidget from "./MyClassesWidget";
// import {Context} from "../../../WidgetWrapper/widgetContext";

// interface WidgetProps {
//   widgetContext: any; // reduce fault tolerance.more to see "../../../WidgetWrapper/widgetContext" or hub `widgetContext`
//   // widgetContext: Context;
// }
export default function Index() {
  return (
    <CssProvider>
      <MyClassesWidget />
    </CssProvider>
  );
}

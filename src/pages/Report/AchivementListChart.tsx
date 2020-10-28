import { makeStyles } from "@material-ui/core";
import { AxisLeft, AxisTop } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarStackHorizontal } from "@visx/shape";
import { BarStack } from "@visx/shape/lib/types";
import { Tooltip, useTooltip } from "@visx/tooltip";
import { UseTooltipParams } from "@visx/tooltip/lib/hooks/useTooltip";
import React, { useMemo } from "react";
import LayoutBox from "../../components/LayoutBox";
import { ReportFilter, StatusColor } from "./types";

const useStyle = makeStyles({
  chart: {
    position: "relative",
  },
  svg: {
    marginTop: 24,
    backgroundColor: "rgba(0,0,0, .02)",
  },
  desc: {
    alignmentBaseline: "middle",
    stroke: "black",
  },
  axiosLine: {
    stroke: "#999999",
  },
});

const pixels = {
  barStackWidth: 1200,
  barStackHeight: 55,
  barStackMargin: 48,
  yMarginLeft: 180,
  yMarginRight: 180,
  descMarginLeft: 16,
};

const inlineStyles = {
  yAxiosTickLabel: {
    stroke: "#0E78D5",
    fontSize: 18,
    textAnchor: "end" as const,
    dx: -37,
  },
  xAxiosLabel: {
    x: pixels.barStackWidth,
    y: 24,
    fontSize: 16,
    stroke: "#999",
    textAnchor: "end" as const,
  },
};

type TBarStack = BarStack<RatioExtendedDataItem, string>;
type TBar = TBarStack["bars"][0];
type RatioKey = typeof RATIO_KEYS[keyof typeof RATIO_KEYS];
type CountKey = typeof COUNT_KEYS[keyof typeof COUNT_KEYS];

const RATIO_KEYS = {
  [ReportFilter.achieved]: "achieved_ratio" as const,
  [ReportFilter.not_achieved]: "not_achieved_ratio" as const,
  [ReportFilter.not_attempted]: "not_attempted_ratio" as const,
};
const COUNT_KEYS = {
  [ReportFilter.achieved]: "achieved_count" as const,
  [ReportFilter.not_achieved]: "not_achieved_count" as const,
  [ReportFilter.not_attempted]: "not_attempted_count" as const,
};

const ratioKey2countKey = (ratioKey: RatioKey): CountKey => {
  const [filter] = Object.entries(RATIO_KEYS).find(([k, v]) => (v = ratioKey)) || [];
  return COUNT_KEYS[(filter as unknown) as keyof typeof COUNT_KEYS];
};

type RatioExtendedDataItem = DataItem &
  {
    [key in RatioKey | "sum"]: number;
  };
const mapRatio = (data: DataItem[]): RatioExtendedDataItem[] => {
  return data.map((item) => {
    const { achieved_count = 0, not_achieved_count = 0, not_attempted_count = 0 } = item;
    const sum = achieved_count + not_achieved_count + not_attempted_count;
    return {
      ...item,
      [RATIO_KEYS[ReportFilter.achieved]]: (100 * achieved_count) / sum,
      [RATIO_KEYS[ReportFilter.not_achieved]]: (100 * not_achieved_count) / sum,
      [RATIO_KEYS[ReportFilter.not_attempted]]: (100 * not_attempted_count) / sum,
      sum,
    };
  });
};

const computed = (props: AchivementListChartProps) => {
  const { filter } = props;
  const data = mapRatio(props.data);
  const xMax = Math.max(
    ...data.map((item) => {
      const { achieved_count = 0, not_achieved_count = 0, not_attempted_count = 0 } = item;
      return achieved_count + not_achieved_count + not_attempted_count;
    })
  );
  const barStacksHeight = data.length * (pixels.barStackHeight + pixels.barStackMargin);
  const xScale = scaleLinear({ domain: [0, xMax], range: [0, pixels.barStackWidth] });
  const paddingRatio = pixels.barStackMargin / (pixels.barStackMargin + pixels.barStackHeight);
  const yScale = scaleBand({ domain: data.map((item) => item.student_name), range: [barStacksHeight, 0], padding: paddingRatio });
  const ratioKeys = filter === ReportFilter.all ? Object.values(RATIO_KEYS) : [RATIO_KEYS[filter]];
  const colorScale = scaleOrdinal({
    domain: ratioKeys,
    range: filter === ReportFilter.all ? Object.values(StatusColor) : [StatusColor[filter]],
  });
  const getY = (data: DataItem) => data.student_name;
  return { data, xScale, yScale, colorScale, getY, ratioKeys, barStacksHeight };
};

const showBarTooltip = (bar: TBar, showTooltip: UseTooltipParams<TBar>["showTooltip"]) => {
  console.log("call showBarTooltip");
  showTooltip({
    tooltipLeft: bar.x + pixels.yMarginLeft + bar.width / 2,
    tooltipTop: bar.y,
    tooltipData: bar,
  });
};
interface DataItem {
  student_name: string;
  achieved_count: number;
  not_achieved_count: number;
  not_attempted_count: number;
}
interface AchivementListChartProps {
  data: DataItem[];
  filter: ReportFilter;
}
export function AchivementListChart(props: AchivementListChartProps) {
  const css = useStyle();
  const { filter } = props;
  const { data, xScale, yScale, colorScale, getY, ratioKeys, barStacksHeight } = useMemo(() => computed(props), [props]);
  const { tooltipOpen, tooltipData, tooltipTop, tooltipLeft, showTooltip, hideTooltip } = useTooltip<TBar>();

  const rectList = (barStacks: TBarStack[]) =>
    barStacks.map((barStack) =>
      barStack.bars.map((bar) => (
        <rect
          key={`bar-${bar.key}-${bar.index}`}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          fill={bar.color}
          onMouseOver={() => showBarTooltip(bar, showTooltip)}
          onMouseLeave={hideTooltip}
        />
      ))
    );
  const descriptionList = (barStacks: TBarStack[]) =>
    barStacks.slice(-1)[0].bars.map((bar) => (
      <text key={`desc-${bar.index}`} x={bar.x + bar.width + pixels.descMarginLeft} y={bar.y + 0.5 * bar.height} className={css.desc}>
        {filter === ReportFilter.all ? 100 : data[bar.index][RATIO_KEYS[filter]].toFixed(0)}%,&nbsp;
        {filter === ReportFilter.all ? data[bar.index].sum : data[bar.index][COUNT_KEYS[filter]]}&nbsp;LOs
      </text>
    ));
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.chart}>
        <svg width={pixels.barStackWidth + pixels.yMarginLeft + pixels.yMarginRight} height={barStacksHeight} className={css.svg}>
          <Group left={pixels.yMarginLeft}>
            <BarStackHorizontal
              data={data}
              keys={ratioKeys}
              height={barStacksHeight}
              xScale={xScale}
              yScale={yScale}
              color={colorScale}
              y={getY}
            >
              {(barStacks) => [rectList(barStacks), descriptionList(barStacks)]}
            </BarStackHorizontal>
            <AxisLeft hideTicks scale={yScale} axisLineClassName={css.axiosLine} tickLabelProps={() => inlineStyles.yAxiosTickLabel} />
            <AxisTop
              hideTicks
              top={0}
              scale={xScale}
              axisLineClassName={css.axiosLine}
              label="in % of all Learning Outcomes"
              labelOffset={0}
              labelProps={inlineStyles.xAxiosLabel}
            />
          </Group>
        </svg>
        {tooltipOpen && tooltipData && (
          <Tooltip top={tooltipTop} left={tooltipLeft} offsetLeft={0} offsetTop={-4}>
            <span>
              {tooltipData.bar.data[tooltipData.key as RatioKey].toFixed(0)}%&nbsp;&nbsp;
              {tooltipData.bar.data[ratioKey2countKey(tooltipData.key as RatioKey)]}&nbsp;LOs
            </span>
          </Tooltip>
        )}
      </div>
    </LayoutBox>
  );
}

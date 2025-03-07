<template>
    <div :class="{ 'ch-container': true, 'dark-mode': darkMode }">
        <svg class="ch-wrapper" ref="svg" :viewBox="viewbox">
            <g class="ch-months-labels-wrapper" :transform="monthsLabelWrapperTransform">
                <text class="ch-month-label" v-for="(month, index) in heatmap.firstFullWeekOfMonths" :key="index"
                    :x="getMonthLabelPosition(month).x" :y="getMonthLabelPosition(month).y">
                    {{ locale.months[month.value] }}
                </text>
            </g>

            <g class="ch-days-labels-wrapper" :transform="daysLabelWrapperTransform">
                <text class="ch-day-label" v-for="(day, index) in locale.days" :key="index"
                    :x="getDayLabelPosition(index).x" :y="getDayLabelPosition(index).y - 8">
                    {{ day }}
                </text>
            </g>

            <g class="ch-year-wrapper" :transform="yearWrapperTransform" @mouseover="initTooltip">
                <g class="ch-month-wrapper" v-for="(week, weekIndex) in heatmap.calendar" :key="weekIndex"
                    :transform="getWeekPosition(weekIndex)">
                    <template v-for="(day, dayIndex) in week" :key="dayIndex">
                        <rect class="ch-day-square" v-if="day.date && !day.isEmpty" :rx="round" :ry="round"
                            :transform="getDayPosition(dayIndex)" :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                            :height="SQUARE_SIZE - SQUARE_BORDER_SIZE" :style="{ fill: rangeColors[day.colorIndex] }"
                            :data-week-index="weekIndex" :data-day-index="dayIndex" @click="$emit('dayClick', day)" />
                    </template>
                </g>
            </g>
        </svg>
        <div class="ch-legend">
            <slot name="legend">
                <div class="ch-legend-left">
                    <slot name="ch-legend-left"></slot>
                </div>
                <div class="ch-legend-right">
                    <slot name="legend-right">
                        <div class="ch-legend">
                            <div>{{ locale.less }}</div>
                            <svg v-if="!vertical" class="ch-external-legend-wrapper" :viewBox="legendViewbox"
                                :height="SQUARE_SIZE - SQUARE_BORDER_SIZE">
                                <g class="ch-legend-wrapper">
                                    <rect v-for="(color, index) in rangeColors" :key="index" :rx="round" :ry="round"
                                        :style="{ fill: color }" :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                                        :height="SQUARE_SIZE - SQUARE_BORDER_SIZE" :x="SQUARE_SIZE * index" />
                                </g>
                            </svg>
                            <div>{{ locale.more }}</div>
                        </div>
                    </slot>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick, toRef } from 'vue';
import tippy, { createSingleton } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/svg-arrow.css';

class Heatmap {
    static SQUARE_SIZE = 15; // 增大方块大小以适应容器
    static DAYS_IN_WEEK = 7;
    static DEFAULT_RANGE_COLOR_LIGHT = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    static DEFAULT_RANGE_COLOR_DARK = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
    static DEFAULT_LOCALE = {
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        on: 'on',
        less: 'Less',
        more: 'More'
    };
    static DEFAULT_TOOLTIP_UNIT = 'contributions';

    constructor(endDate, values, max = null) {
        this.endDate = new Date(endDate);
        this.max = max || Math.max(...values.map(v => v.count || 0));
        this.calendar = this.createCalendar(values);
        this.firstFullWeekOfMonths = this.getFirstFullWeekOfMonths();
        this.weekCount = this.calendar.length;
    }

    createCalendar(values) {
        console.log('---------结束日期：', this.endDate);
        const calendar = [];
        const endDate = new Date(this.endDate);
        
        // 计算起始日期：从结束日期倒推一年，然后找到最近的周一
        const yearAgo = new Date(endDate);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        
        // 调整到最近的周一
        const dayOfWeek = yearAgo.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日时 dayOfWeek 为 0
        yearAgo.setDate(yearAgo.getDate() + diff);
        
        // 生成52周的数据
        for (let week = 0; week < 53; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(yearAgo);
                currentDate.setDate(currentDate.getDate() + (week * 7) + day);
                
                // 检查日期是否在有效范围内
                const isValidDate = currentDate >= yearAgo && currentDate <= endDate;
                
                if (isValidDate) {
                    const value = values.find(v => new Date(v.date).toDateString() === currentDate.toDateString());
                    weekData.push({
                        date: currentDate,
                        count: value ? value.count : 0,
                        colorIndex: value ? Math.ceil((value.count / this.max) * 4) : 0
                    });
                } else {
                    weekData.push({
                        date: currentDate,
                        isEmpty: true,
                        count: 0,
                        colorIndex: 0
                    });
                }
            }
            calendar.push(weekData);
        }
        
        return calendar;
    }

    getFirstFullWeekOfMonths() {
        const months = [];
        
        // 处理开始日期所在的月份
        const startDate = this.calendar[0][0].date;
        if (startDate) {
            const startMonth = startDate.getMonth();
            months.push({
                value: startMonth,
                index: 0
            });
        }

        // 处理结束日期所在的月份
        const endMonth = this.endDate.getMonth();
        // 从日历数组的末尾开始查找该月份的最后一周
        for (let i = this.calendar.length - 1; i >= 0; i--) {
            const week = this.calendar[i];
            for (const day of week) {
                if (day.date && day.date.getMonth() === endMonth) {
                    months.push({
                        value: endMonth,
                        index: i
                    });
                    break;
                }
            }
            if (months.length > 1) break;
        }

        // 处理中间的月份
        const monthSet = new Set();
        this.calendar.forEach((week, weekIndex) => {
            week.forEach((day) => {
                if (day.date) {
                    const monthValue = day.date.getMonth();
                    if (!monthSet.has(monthValue) && monthValue !== startDate?.getMonth() && monthValue !== endMonth) {
                        monthSet.add(monthValue);
                        months.push({
                            value: monthValue,
                            index: weekIndex
                        });
                    }
                }
            });
        });

        return months;
    }
}

export default defineComponent({
    name: 'CalendarHeatmap',
    props: {
        endDate: {
            required: true
        },
        values: {
            type: Array,
            required: true
        },
        max: Number,
        rangeColor: Array,
        locale: Object,
        tooltip: {
            type: Boolean,
            default: true
        },
        tooltipUnit: {
            type: String,
            default: Heatmap.DEFAULT_TOOLTIP_UNIT
        },
        tooltipFormatter: Function,
        vertical: {
            type: Boolean,
            default: false
        },
        noDataText: {
            type: [Boolean, String],
            default: null
        },
        round: {
            type: Number,
            default: 0
        },
        darkMode: Boolean,

        responsive: {
            type: Boolean,
            default: true
        }
    },
    emits: ['dayClick'],
    setup(props) {
        // 基础尺寸计算
        const SQUARE_BORDER_SIZE = ref(Heatmap.SQUARE_SIZE / 4);
        const SQUARE_SIZE = ref(Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE.value);
        const LEFT_SECTION_WIDTH = ref(Math.ceil(Heatmap.SQUARE_SIZE * 2));
        const RIGHT_SECTION_WIDTH = ref(SQUARE_SIZE.value * 4);
        const TOP_SECTION_HEIGHT = ref(Heatmap.SQUARE_SIZE * 2);
        const BOTTOM_SECTION_HEIGHT = ref(Heatmap.SQUARE_SIZE * 2);
        const yearWrapperTransform = ref(`translate(${LEFT_SECTION_WIDTH.value}, ${TOP_SECTION_HEIGHT.value})`);

        const svg = ref(null);
        const now = ref(new Date());
        const heatmap = ref(new Heatmap(props.endDate, props.values, props.max));
        const width = ref(0);
        const height = ref(0);
        const viewbox = ref('0 0 0 0');
        const legendViewbox = ref('0 0 0 0');
        const daysLabelWrapperTransform = ref('');
        const monthsLabelWrapperTransform = ref('');
        const legendWrapperTransform = ref('');
        const locale = ref(props.locale || Heatmap.DEFAULT_LOCALE);
        const rangeColors = ref(props.rangeColor || (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT));

        watch(() => props.rangeColor, (newColor) => {
            rangeColors.value = newColor || (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT);
        });

        watch(() => props.darkMode, (isDark) => {
            if (!props.rangeColor) {
                rangeColors.value = isDark ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT;
            }
        });

        const tippyInstances = new Map();
        let tippySingleton;

        function tooltipOptions(day) {
            if (!props.tooltip || !day) return null;
            const count = day.count;
            const date = day.date;
            if (props.tooltipFormatter) {
                return props.tooltipFormatter(count, date);
            }
            return count === 0 && props.noDataText
                ? props.noDataText === true ? '无数据' : props.noDataText
                : `${count} ${props.tooltipUnit} ${locale.value.on} ${date.toLocaleDateString()}`;
        }

        function initTippy() {
            if (!props.tooltip || !svg.value) return;
            const squares = svg.value.querySelectorAll('.ch-day-square');
            squares.forEach((square) => {
                const weekIndex = Number(square.dataset.weekIndex);
                const dayIndex = Number(square.dataset.dayIndex);
                if (!isNaN(weekIndex) && !isNaN(dayIndex)) {
                    const day = heatmap.value.calendar[weekIndex][dayIndex];
                    const content = tooltipOptions(day);
                    if (content) {
                        const instance = tippy(square, {
                            content,
                            arrow: true,
                            theme: props.darkMode ? 'dark' : 'light'
                        });
                        tippyInstances.set(square, instance);
                    }
                }
            });
            tippySingleton = createSingleton(Array.from(tippyInstances.values()), {
                delay: [50, 0],
                moveTransition: 'transform 0.1s ease-out'
            });
        }

        watch([() => props.values, toRef(props, 'tooltipUnit'), () => props.tooltipFormatter, () => props.noDataText, () => props.max, () => props.rangeColor, () => props.viewMode], () => {
            heatmap.value = new Heatmap(props.endDate, props.values, props.max, props.viewMode);
            tippyInstances.forEach((item) => item.destroy());
            nextTick(initTippy);
        });

        function calculateSquareSize() {
            SQUARE_BORDER_SIZE.value = Heatmap.SQUARE_SIZE / 4;
            SQUARE_SIZE.value = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE.value;
            LEFT_SECTION_WIDTH.value = Math.ceil(SQUARE_SIZE.value * 1.5);
            RIGHT_SECTION_WIDTH.value = SQUARE_SIZE.value * 4;
            TOP_SECTION_HEIGHT.value = SQUARE_SIZE.value * 1.5;
            BOTTOM_SECTION_HEIGHT.value = SQUARE_SIZE.value * 1.5;
            yearWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH.value}, ${TOP_SECTION_HEIGHT.value})`;
        }

        // 监听视图模式变化和响应式调整
        watch([() => props.vertical, () => props.responsive, () => heatmap.value.weekCount], ([v, responsive, weekCount]) => {
            // 计算方块大小
            calculateSquareSize();

            // 根据响应式设置调整大小
            const containerWidth = responsive ? '100%' : undefined;

            if (v) {
                width.value = LEFT_SECTION_WIDTH.value + (SQUARE_SIZE.value * Heatmap.DAYS_IN_WEEK) + RIGHT_SECTION_WIDTH.value;
                height.value = TOP_SECTION_HEIGHT.value + (SQUARE_SIZE.value * weekCount) + SQUARE_BORDER_SIZE.value;
                daysLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH.value}, 0)`;
                monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT.value})`;
            } else {
                width.value = LEFT_SECTION_WIDTH.value + (SQUARE_SIZE.value * weekCount);
                height.value = TOP_SECTION_HEIGHT.value + (SQUARE_SIZE.value * Heatmap.DAYS_IN_WEEK) + BOTTOM_SECTION_HEIGHT.value;
                daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT.value})`;
                monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH.value}, 0)`;
            }
        }, { immediate: true });

        watch([() => width.value, () => height.value], ([w, h]) => (viewbox.value = `0 0 ${w} ${h}`), { immediate: true });
        watch([() => width.value, () => height.value, () => rangeColors.value], ([w, h, rc]) => {
            legendWrapperTransform.value = props.vertical
                ? `translate(${LEFT_SECTION_WIDTH.value + (SQUARE_SIZE.value * Heatmap.DAYS_IN_WEEK)}, ${TOP_SECTION_HEIGHT.value})`
                : `translate(${w - (SQUARE_SIZE.value * rc.length) - 30}, ${h - BOTTOM_SECTION_HEIGHT.value})`;
        }, { immediate: true });

        const localeRef = toRef(props, 'locale');
        watch(localeRef, l => (locale.value = l ? { ...Heatmap.DEFAULT_LOCALE, ...l } : Heatmap.DEFAULT_LOCALE), { immediate: true });
        watch(() => rangeColors.value, rc => (legendViewbox.value = `0 0 ${SQUARE_SIZE.value * (rc.length + 1)} ${SQUARE_SIZE.value}`), { immediate: true });

        watch(
            [props.values, props.tooltipUnit, props.tooltipFormatter, props.noDataText, props.max, props.rangeColor, props.viewMode],
            () => {
                heatmap.value = new Heatmap(props.endDate, props.values, props.max, props.viewMode);
                tippyInstances.forEach((item) => item.destroy());
                nextTick(initTippy);
            }
        );


        // 监听窗口大小变化，重新计算方块大小
        onMounted(() => {
            window.addEventListener('resize', calculateSquareSize);
            calculateSquareSize();
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', calculateSquareSize);
        });

        onMounted(initTippy);
        onBeforeUnmount(() => {
            tippySingleton?.destroy();
            tippyInstances.forEach((item) => item.destroy());
        });

        function getWeekPosition(weekIndex) {
            return props.vertical
                ? `translate(0, ${SQUARE_SIZE.value * weekIndex})`
                : `translate(${SQUARE_SIZE.value * weekIndex}, 0)`;
        }

        function getDayPosition(dayIndex) {
            return props.vertical
                ? `translate(${SQUARE_SIZE.value * dayIndex}, 0)`
                : `translate(0, ${SQUARE_SIZE.value * dayIndex})`;
        }

        function getMonthLabelPosition(month) {
            return props.vertical
                ? { x: -5, y: SQUARE_SIZE.value * month.index + (SQUARE_SIZE.value / 2) }
                : { x: SQUARE_SIZE.value * month.index, y: SQUARE_SIZE.value };
        }

        function getDayLabelPosition(dayIndex) {
            return props.vertical
                ? { x: SQUARE_SIZE.value * dayIndex, y: SQUARE_SIZE.value - SQUARE_BORDER_SIZE.value }
                : { x: 0, y: (dayIndex * SQUARE_SIZE.value) + 20 };
        }

        function initTooltip() {
            if (!props.tooltip) return;
            nextTick(initTippy);
        }

        return {
            SQUARE_BORDER_SIZE,
            SQUARE_SIZE,
            LEFT_SECTION_WIDTH,
            RIGHT_SECTION_WIDTH,
            TOP_SECTION_HEIGHT,
            BOTTOM_SECTION_HEIGHT,
            svg,
            heatmap,
            now,
            width,
            height,
            viewbox,
            daysLabelWrapperTransform,
            monthsLabelWrapperTransform,
            yearWrapperTransform,
            legendWrapperTransform,
            locale,
            legendViewbox,
            rangeColors,
            getWeekPosition,
            getDayPosition,
            getMonthLabelPosition,
            getDayLabelPosition,
            initTooltip
        };
    }
});
</script>

<style lang="scss">
.ch-container {
    width: 100%;

    .ch-view-toggle {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        .ch-toggle-btn {
            padding: 4px 12px;
            font-size: 12px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 8px;
            transition: all 0.2s ease;

            &:hover {
                background-color: #e9e9e9;
            }

            &.active {
                background-color: #4a86e8;
                color: white;
                border-color: #4a86e8;
            }
        }
    }

    .ch-legend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .ch-external-legend-wrapper {
        margin: 0 8px;
    }
}

svg.ch-wrapper {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 10px;
    width: 100%;
    height: auto;
    display: block;

    .ch-months-labels-wrapper text.ch-month-label {
        font-size: 10px;
    }

    .ch-days-labels-wrapper text.ch-day-label,
    .ch-legend-wrapper text {
        font-size: 9px;
    }

    text.ch-month-label,
    text.ch-day-label,
    .ch-legend-wrapper text {
        fill: #767676;
    }

    rect.ch-day-square:hover {
        stroke: #555;
        stroke-width: 2px;
        paint-order: stroke;
    }

    rect.ch-day-square:focus {
        outline: none;
    }

    &.dark-mode {

        text.ch-month-label,
        text.ch-day-label,
        .ch-legend-wrapper text {
            fill: #fff;
        }
    }
}
</style>

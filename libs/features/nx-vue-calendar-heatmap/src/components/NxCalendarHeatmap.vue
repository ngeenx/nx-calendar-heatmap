<template>
  <div class="nx-calendar-heatmap">
    <div class="heatmap-grid">
      <!-- First Week Empty Days -->
      <template v-if="!mergedOptions.hideEmptyDays">
        <button
          v-for="firstWeekDayOffset in firstWeekOffset"
          :key="'empty-' + firstWeekDayOffset"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
          @mouseover="tippyUtils?.lazyLoadTooltip($event, null)"
        />
      </template>

      <!-- Available Days -->
      <button
        v-for="(day, index) in heatmapData"
        :key="index"
        class="day"
        :class="getDayClass(day.count)"
        :style="getGridPosition(index)"
        @click="onDayClick(day)"
        @mouseover="tippyUtils?.lazyLoadTooltip($event, day)"
      />

      <!-- Last Week Empty Days -->
      <template v-if="!mergedOptions.hideEmptyDays">
        <button
          v-for="lastWeekDayOffset in lastWeekOffset"
          :key="'empty-' + lastWeekDayOffset"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
          @mouseover="tippyUtils?.lazyLoadTooltip($event, null)"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, StyleValue, onUnmounted, onMounted } from 'vue';
import { DateTime } from 'luxon';
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
  TippyUtils,
} from '@ngeenx/nx-calendar-heatmap-utils';

// third party
import 'tippy.js/dist/tippy.css';

const levels = ref(4);
const min = ref(0);
const max = ref(0);
const range = ref(0);
const step = ref(0);
const colors = ref<IHeatmapColor[]>([]);
const heatmapData = computed(() => props.heatmapData || []);
const firstWeekOffset = ref<number>(0);
const lastWeekOffset = ref<number>(0);
const emptyCellStyle = ref<StyleValue>();

const defaultOptions: ICalendarHeatmapOptions = {
  type: HeatMapCalendarType.YEARLY,
  startDate: DateTime.now().startOf('year'),
  tooltipUnit: 'contribution',
  tooltipDateFormat: 'MMMM d',
  locale: 'en',
  showTooltip: true,
  i18n: {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    on: 'on',
    less: 'less',
    more: 'more',
    noData: 'No Data',
  },
};

let tippyUtils: TippyUtils | undefined;

/**
 * Component props
 */
const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({}),
  },
  heatmapData: {
    type: Array as () => IHeatmapDay[],
    default: () => [],
  },
});

const mergedOptions = computed(() => {
  return {
    ...defaultOptions,
    ...props.options,
    i18n: {
      ...defaultOptions.i18n,
      ...props.options.i18n,
    },
  };
});

/**
 * Calculate the number of empty cells before the first date
 *
 * @param startDate - The start date (luxon)
 */
const calculateFirstWeekOffset = (startDate: DateTime): number => {
  // Luxon: 1 = Monday, 7 = Sunday
  const weekday = startDate.weekday;

  // console.log(startDate.weekday);

  // Sunday (7) needs 6 empty cells, Monday (1) needs 0
  return weekday === 7 ? 6 : weekday - 1;
};

/**
 * Calculate the number of empty cells after the last date
 *
 * @param endDate - The end date (luxon)
 */
const calculateLastWeekOffset = (endDate: DateTime): number => {
  // Luxon: 1 = Monday, 7 = Sunday
  const weekday = endDate.weekday;

  // Sunday (7) needs 0 empty cells, Monday (1) needs 6
  return weekday === 7 ? 0 : 7 - weekday;
};

/**
 * Grid position calculation depending on format
 *
 * @param index
 */
const getGridPosition = (index: number): StyleValue => {
  if (mergedOptions.value.type === HeatMapCalendarType.WEEKLY) {
    return {
      gridRow: 1,
      gridColumn: index + 1,
      height: (mergedOptions.value.cellSize || 15) + 'px',
      width: (mergedOptions.value.cellSize || 15) + 'px',
    };
  } else {
    return {
      gridRow: ((index + firstWeekOffset.value) % 7) + 1,
      gridColumn: Math.floor((index + firstWeekOffset.value) / 7) + 1,
      height: (mergedOptions.value.cellSize || 15) + 'px',
      width: (mergedOptions.value.cellSize || 15) + 'px',
    };
  }
};

/**
 * Update the heatmap data based on the options
 */
const updateHeatmapData = (): void => {
  emptyCellStyle.value = {
    height: (mergedOptions.value.cellSize || 15) + 'px',
    width: (mergedOptions.value.cellSize || 15) + 'px',
  };

  if (mergedOptions.value.colors) {
    levels.value = mergedOptions.value.colors.length;
  }

  if (levels.value < 4) {
    levels.value = 4;

    console.warn(
      `CalendarHeatmap: The 'levels' option must be at least 4, but it was set to ${levels.value}.`
    );
  }

  colors.value = mergedOptions.value.colors || [];
  min.value = 0;
  max.value = 100;
  range.value = max.value - min.value;
  step.value = range.value / levels.value;

  const { type, startDate } = mergedOptions.value;

  let endDate: DateTime;

  switch (type) {
    case HeatMapCalendarType.WEEKLY:
      // weekly, only 7 days
      endDate = startDate.plus({ days: 6 });

      break;
    case HeatMapCalendarType.MONTHLY:
      // monthly, all days of the month
      endDate = startDate.endOf('month');

      break;
    case HeatMapCalendarType.YEARLY:
      // yearly, full year
      endDate = startDate.endOf('year');

      break;
  }

  if (type !== HeatMapCalendarType.WEEKLY) {
    firstWeekOffset.value = calculateFirstWeekOffset(startDate);
    lastWeekOffset.value = calculateLastWeekOffset(endDate);
  }
};

/**
 * Get the class name of a day based on its value with leveled classes
 *
 * @param value - The value of the day
 */
const getDayClass = (value: number): string => {
  if (!colors.value.length) {
    if (value === 0) {
      return 'level-0';
    }

    for (let i = 0; i < levels.value; i++) {
      if (value <= min.value + step.value * (i + 1)) {
        return `level-${i + 1}`;
      }
    }

    return 'level-0';
  }

  for (const color of colors.value) {
    if (value >= color.min && value <= color.max) {
      return color.className;
    }
  }

  const defaultColor = colors.value?.find(
    (color: IHeatmapColor) => color.isDefault
  );

  if (defaultColor) {
    return defaultColor.className;
  }

  return 'level-0';
};

/**
 * Get the class name of an empty day based on its value with leveled classes
 */
const getEmptyDayClass = (): string => {
  if (!colors.value.length) {
    return 'level-0';
  }

  for (const color of colors.value) {
    if (color.isDefault) {
      return color.className;
    }
  }

  return 'level-0';
};

/**
 * Handle day click event
 *
 * @param day - The day to click
 */
const onDayClick = (day: IHeatmapDay): void => {
  if (mergedOptions.value.onClick !== undefined) {
    mergedOptions.value.onClick(day);
  }
};

/**
 * Watch for changes in the options and update the heatmap data
 */
watch(() => mergedOptions.value, updateHeatmapData, { immediate: true });

onMounted(() => {
  tippyUtils = new TippyUtils(mergedOptions.value);
  tippyUtils.init();
});

onUnmounted(() => {
  tippyUtils?.destroy();
});
</script>

<style scoped lang="scss">
@import '../../../../utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
</style>

<template>
  <div class="nx-calendar-heatmap">
    <!-- Calendar Grid -->
    <div
      class="heatmap-grid"
      :class="{
        monthly: mergedOptions.type === HeatMapCalendarType.MONTHLY,
      }"
    >
      <!-- First Week Empty Days -->
      <template v-if="!mergedOptions.hideEmptyDays">
        <button
          v-for="day in firstWeekOffsetDays"
          :key="'empty-' + day.data"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
          @mouseover="tippyUtils?.lazyLoadTooltip($event, day)"
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
          v-for="day in lastWeekOffsetDays"
          :key="'empty-' + day.data"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
          @mouseover="tippyUtils?.lazyLoadTooltip($event, day)"
        />
      </template>
    </div>

    <!-- Heatmap Levels -->
    <NxHeatmapLevels
      v-if="mergedOptions.heatmapLevels?.display"
      :options="mergedOptions"
      :min="min"
      :max="max"
      :range="range"
      :step="step"
      :levels="levels"
    />
  </div>
</template>

<script lang="ts" setup>
// vue
import { ref, watch, computed, StyleValue, onUnmounted, onMounted } from 'vue';

// libs
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
  DayTippyUtils,
  HeatmapLevelsDirection,
} from '@ngeenx/nx-calendar-heatmap-utils';
import NxHeatmapLevels from './NxHeatmapLevels.vue';

// third party
import { DateTime } from 'luxon';
import 'tippy.js/dist/tippy.css';

const levels = ref(5);
const min = ref(0);
const max = ref(0);
const range = ref(0);
const step = ref(0);
const heatmapData = computed<IHeatmapDay[]>(() => props.heatmapData || []);
const firstWeekOffsetDays = ref<IHeatmapDay[]>([]);
const lastWeekOffsetDays = ref<IHeatmapDay[]>([]);
const emptyCellStyle = ref<StyleValue>();

const defaultOptions: ICalendarHeatmapOptions = {
  type: HeatMapCalendarType.YEARLY,
  startDate: DateTime.now().startOf('year'),
  tooltipUnit: 'contribution',
  tooltipDateFormat: 'MMMM d',
  locale: 'en',
  showTooltip: true,
  heatmapLevels: {
    display: true,
    direction: HeatmapLevelsDirection.RIGHT,
  },
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
    noData: 'No',
  },
};

let tippyUtils: DayTippyUtils | undefined;

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
const calculateFirstWeekOffset = (startDate: DateTime): IHeatmapDay[] => {
  // Luxon: 1 = Monday, 7 = Sunday
  const weekday = startDate.weekday;

  // Sunday (7) needs 6 empty cells, Monday (1) needs 0
  return Array.from(
    { length: weekday === 7 ? 6 : weekday - 1 },
    (_, i) =>
      <IHeatmapDay>{
        date: startDate.minus({ days: i }),
        count: undefined,
        data: i,
      }
  );
};

/**
 * Calculate the number of empty cells after the last date
 *
 * @param endDate - The end date (luxon)
 */
const calculateLastWeekOffset = (endDate: DateTime): IHeatmapDay[] => {
  // Luxon: 1 = Monday, 7 = Sunday
  const weekday = endDate.weekday;

  // Sunday (7) needs 0 empty cells, Monday (1) needs 6
  return Array.from(
    { length: weekday === 7 ? 0 : 7 - weekday },
    (_, i) =>
      <IHeatmapDay>{
        date: endDate.minus({ days: i }),
        count: undefined,
        data: i,
      }
  );
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
      gridRow: ((index + firstWeekOffsetDays.value.length) % 7) + 1,
      gridColumn:
        Math.floor((index + firstWeekOffsetDays.value.length) / 7) + 1,
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

  if (mergedOptions.value.colors?.length) {
    levels.value = mergedOptions.value.colors.length;
  }

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
    firstWeekOffsetDays.value = calculateFirstWeekOffset(startDate);
    lastWeekOffsetDays.value = calculateLastWeekOffset(endDate);
  }
};

/**
 * Get the class name of a day based on its value with leveled classes
 *
 * @param value - The value of the day
 */
const getDayClass = (value: number | undefined): string => {
  const baseClasses = `${mergedOptions.value.onClick ? 'clickable' : ''}`;

  // if we are using default colors
  if (!mergedOptions.value.colors?.length) {
    if (value === 0 || value === undefined) {
      return `${baseClasses} level-0`;
    }

    for (let i = 0; i < levels.value; i++) {
      if (value <= min.value + step.value * (i + 1)) {
        return `${baseClasses} level-${i + 1}`;
      }
    }

    return `${baseClasses} level-0`;
  }

  // if we are using custom colors and value is not undefined (empty days values are undefined)
  if (value !== undefined) {
    for (const color of mergedOptions.value.colors) {
      if (color.min && color.max && value >= color.min && value <= color.max) {
        return color.className;
      }
    }
  }

  // find default color
  const defaultColor =
    mergedOptions.value.colors?.find(
      (color: IHeatmapColor) => color.isDefault
    ) || mergedOptions.value.colors?.[0];

  if (defaultColor) {
    return defaultColor.className;
  }

  return `${baseClasses} level-0`;
};

/**
 * Get the class name of an empty day based on its value with leveled classes
 */
const getEmptyDayClass = (): string => {
  if (!mergedOptions.value.colors?.length) {
    return 'level-0';
  }

  for (const color of mergedOptions.value.colors) {
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
  tippyUtils = new DayTippyUtils(mergedOptions.value);
  tippyUtils.init();
});

onUnmounted(() => {
  tippyUtils?.destroy();
});
</script>

<style scoped lang="scss">
@import '../../../../utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
</style>

<template>
  <div class="nx-calendar-heatmap">
    <div class="heatmap-grid">
      <!-- First Week Empty Days -->
      <template v-if="!props.options.hideEmptyDays">
        <button
          v-for="firstWeekDayOffset in firstWeekOffset"
          :key="'empty-' + firstWeekDayOffset"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
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
      />

      <!-- Last Week Empty Days -->
      <template v-if="!props.options.hideEmptyDays">
        <button
          v-for="lastWeekDayOffset in lastWeekOffset"
          :key="'empty-' + lastWeekDayOffset"
          class="day"
          :class="getEmptyDayClass()"
          :style="emptyCellStyle"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, StyleValue } from 'vue';
import { DateTime } from 'luxon';
import {
  ICalendarHeatmapOptions,
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
} from '@ngeenx/nx-calendar-heatmap-utils';

const levels = ref(4);
const min = ref(0);
const max = ref(0);
const range = ref(0);
const step = ref(0);
const colors = ref<IHeatmapColor[]>([]);
const heatmapData = ref<IHeatmapDay[]>([]);
const firstWeekOffset = ref<number>(0);
const lastWeekOffset = ref<number>(0);
const emptyCellStyle = ref<StyleValue>();

/**
 * Component props
 */
const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({
      type: 'yearly',
      startDate: DateTime.local(2023, 1, 1).toISODate(),
    }),
  },
});

// Generate heatmap data for the given date range
const generateHeatmapData = (startDate: DateTime, endDate: DateTime) => {
  const daysBetween = Math.floor(endDate.diff(startDate, 'days').days);
  const heatmap = [];

  let currentDate = startDate;

  for (let i = 0; i <= daysBetween; i++) {
    const day: IHeatmapDay = {
      date: currentDate,
      count: Math.floor(Math.random() * 101), // Random value between 0-100
    };

    heatmap.push(day);

    currentDate = currentDate.plus({ days: 1 });
  }

  return heatmap;
};

/**
 * Calculate the number of empty cells before the first date
 *
 * @param startDate - The start date (luxon)
 */
const calculateFirstWeekOffset = (startDate: DateTime) => {
  // Luxon: 1 = Monday, 7 = Sunday
  const weekday = startDate.weekday;

  // Sunday (7) needs 6 empty cells, Monday (1) needs 0
  return weekday === 7 ? 6 : weekday - 1;
};

/**
 * Calculate the number of empty cells after the last date
 *
 * @param endDate - The end date (luxon)
 */
const calculateLastWeekOffset = (endDate: DateTime) => {
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
  if (props.options.type === HeatMapCalendarType.WEEKLY) {
    return {
      gridRow: 1,
      gridColumn: index + 1,
      height: (props.options.cellSize || 15) + 'px',
      width: (props.options.cellSize || 15) + 'px',
    };
  } else {
    return {
      gridRow: ((index + firstWeekOffset.value) % 7) + 1,
      gridColumn: Math.floor((index + firstWeekOffset.value) / 7) + 1,
      height: (props.options.cellSize || 15) + 'px',
      width: (props.options.cellSize || 15) + 'px',
    };
  }
};

/**
 * Update the heatmap data based on the options
 */
const updateHeatmapData = (): void => {
  emptyCellStyle.value = {
    height: (props.options.cellSize || 15) + 'px',
    width: (props.options.cellSize || 15) + 'px',
  };

  if (props.options.colors) {
    levels.value = props.options.colors.length;
  }

  if (levels.value < 4) {
    levels.value = 4;

    console.warn(
      `CalendarHeatmap: The 'levels' option must be at least 4, but it was set to ${levels.value}.`
    );
  }

  colors.value = props.options.colors || [];
  min.value = 0;
  max.value = 100;
  range.value = max.value - min.value;
  step.value = range.value / levels.value;

  const { type, startDate } = props.options;

  let endDate: DateTime;

  switch (type) {
    case HeatMapCalendarType.WEEKLY:
      // weekly, only 7 days
      endDate = DateTime.fromISO(startDate).plus({ days: 6 });

      break;
    case HeatMapCalendarType.MONTHLY:
      // monthly, all days of the month
      endDate = DateTime.fromISO(startDate).endOf('month');

      break;
    case HeatMapCalendarType.YEARLY:
      // yearly, full year
      endDate = DateTime.fromISO(startDate).endOf('year');

      break;
  }

  heatmapData.value = generateHeatmapData(DateTime.fromISO(startDate), endDate);

  if (type !== HeatMapCalendarType.WEEKLY) {
    firstWeekOffset.value = calculateFirstWeekOffset(
      DateTime.fromISO(startDate)
    );
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
  if (props.options.onClick !== undefined) {
    props.options.onClick(day);
  }
};

/**
 * Watch for changes in the options and update the heatmap data
 */
watch(() => props.options, updateHeatmapData, { immediate: true });
</script>

<style scoped lang="scss">
@import '../../../../utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
</style>

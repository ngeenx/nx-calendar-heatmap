<template>
  <div class="calendar-heatmap">
    <div class="heatmap-grid">
      <!-- First Week Empty Days -->
      <template v-if="!props.options.hideEmptyDays">
        <button
          v-for="empty in firstWeekOffset"
          :key="'empty-' + empty"
          class="day"
          :class="getEmptyDayClass()"
          :style="{
            height: (props.options.cellSize || 15) + 'px',
            width: (props.options.cellSize || 15) + 'px',
          }"
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
          v-for="empty in lastWeekOffset"
          :key="'empty-' + empty"
          class="day"
          :class="getEmptyDayClass()"
          :style="{
            height: (props.options.cellSize || 15) + 'px',
            width: (props.options.cellSize || 15) + 'px',
          }"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
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

const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({
      type: 'yearly',
      startDate: DateTime.local(2023, 1, 1).toISODate(),
    }),
  },
});

// Calculate the number of empty cells before the first date
const calculateFirstWeekOffset = (startDate: DateTime) => {
  const weekday = startDate.weekday; // Luxon: 1 = Monday, 7 = Sunday

  return weekday === 7 ? 6 : weekday - 1; // Sunday (7) needs 6 empty cells, Monday (1) needs 0
};

const calculateLastWeekOffset = (endDate: DateTime) => {
  const weekday = endDate.weekday; // Luxon: 1 = Monday, 7 = Sunday

  return weekday === 7 ? 0 : 7 - weekday; // Sunday (7) needs 0 empty cells, Monday (1) needs 6
};

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

// Grid position calculation depending on format
const getGridPosition = (index: number) => {
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

const heatmapData = ref<IHeatmapDay[]>([]);
const firstWeekOffset = ref<number>(0);
const lastWeekOffset = ref<number>(0);

const updateHeatmapData = () => {
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

// Watch for prop changes and update heatmap accordingly
watch(() => props.options, updateHeatmapData, { immediate: true });

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

const onDayClick = (day: IHeatmapDay): void => {
  if (props.options.onClick !== undefined) {
    props.options.onClick(day);
  }
};
</script>

<style scoped lang="scss">
@import '../../../../utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
</style>

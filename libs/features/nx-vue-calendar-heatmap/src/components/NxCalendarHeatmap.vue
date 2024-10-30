<template>
  <!-- Calendar Container -->
  <div class="nx-calendar-heatmap">
    <!-- Body -->
    <div class="body">
      <div class="weekdays-container">
        <!-- Weekdays -->
        <div
          v-if="mergedOptions.type !== HeatMapCalendarType.WEEKLY"
          class="weekdays"
        >
          <span
            v-for="(weekday, index) in mergedOptions.i18n?.weekdays"
            :key="index"
          >
            {{ weekday }}
          </span>
        </div>

        <!-- Months -->
        <div class="months-container">
          <!-- Yearly -->
          <div
            v-if="mergedOptions.type === HeatMapCalendarType.YEARLY"
            class="months"
          >
            <span
              v-for="(month, index) of mergedOptions.i18n?.months"
              :key="index"
            >
              {{ month }}
            </span>
          </div>

          <!-- Monthly -->
          <div
            v-if="mergedOptions.type === HeatMapCalendarType.MONTHLY"
            class="months"
          >
            <span class="centered">
              {{
                calendarUtils.getLocalizedMonthName(
                  mergedOptions.startDate,
                  mergedOptions.locale
                )
              }}
            </span>
          </div>

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
                v-for="(day, index) in firstWeekOffsetDays"
                :key="index"
                class="day"
                :class="getEmptyDayClass()"
                :style="emptyCellStyle"
                @mouseover="onDayMouseOver($event, day)"
              />
            </template>

            <!-- Available Days -->
            <button
              v-for="(day, index) in data"
              :key="index"
              class="day"
              :class="getDayClass(day.count)"
              :style="getGridPosition(index)"
              @click="onDayClick(day)"
              @mouseover="onDayMouseOver($event, day)"
            />

            <!-- Last Week Empty Days -->
            <template v-if="!mergedOptions.hideEmptyDays">
              <button
                v-for="(day, index) in lastWeekOffsetDays"
                :key="index"
                class="day"
                :class="getEmptyDayClass()"
                :style="emptyCellStyle"
                @mouseover="onDayMouseOver($event, day)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="mergedOptions.heatmapLegend?.display" class="footer">
      <!-- Footer Content -->
      <div class="footer-content">
        <slot name="footerContent" />
      </div>

      <div class="legend">
        <!-- Heatmap Legend -->
        <NxHeatmapLegend
          :options="mergedOptions"
          :min="min"
          :max="max"
          :range="range"
          :step="step"
          :levels="levels"
        />
      </div>
    </div>
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
  CalendarUtils,
} from '@ngeenx/nx-calendar-heatmap-utils';
import NxHeatmapLegend from './NxHeatmapLegend.vue';

// third party
import { DateTime } from 'luxon';
import { Props } from 'tippy.js';

const levels = ref(5);
const min = ref(0);
const max = ref(0);
const range = ref(0);
const step = ref(0);
const data = computed<IHeatmapDay[]>(() => props.data || []);
const firstWeekOffsetDays = ref<IHeatmapDay[]>([]);
const lastWeekOffsetDays = ref<IHeatmapDay[]>([]);
const emptyCellStyle = ref<StyleValue>();

const defaultOptions: ICalendarHeatmapOptions = {
  type: HeatMapCalendarType.YEARLY,
  startDate: DateTime.now().startOf('year'),
  locale: 'en',
  tooltip: {
    display: true,
    unit: 'contribution',
    dateFormat: 'MMMM d',
  },
  tippyProps: {
    placement: 'top',
  } as Props,
  heatmapLegend: {
    display: true,
    direction: HeatmapLevelsDirection.RIGHT,
  },
  i18n: {
    on: 'on',
    less: 'less',
    more: 'more',
    noData: 'No',
    min: 'min',
    max: 'max',
  },
};

let tippyUtils!: DayTippyUtils;
let calendarUtils: CalendarUtils = new CalendarUtils(defaultOptions);

defaultOptions.i18n!.months = calendarUtils.getLocalizedMonthNames();
defaultOptions.i18n!.weekdays = calendarUtils.getLocalizedWeekdayNames();

/**
 * Component props
 */
const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({}),
  },
  data: {
    type: Array as () => IHeatmapDay[],
    default: () => [],
  },
});

const mergedOptions = computed((): ICalendarHeatmapOptions => {
  return {
    ...defaultOptions,
    ...props.options,
    i18n: {
      ...defaultOptions.i18n,
      ...props.options.i18n,
    },
    heatmapLegend: {
      ...defaultOptions.heatmapLegend,
      ...props.options.heatmapLegend,
    },
    tooltip: {
      ...defaultOptions.tooltip,
      ...props.options.tooltip,
    },
  };
});

// #region Styling

/**
 * Grid position calculation depending on format
 *
 * @param index
 */
const getGridPosition = (index: number): StyleValue => {
  return calendarUtils.getGridPositionOfDay(
    index,
    firstWeekOffsetDays.value.length
  ) as StyleValue;
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

// #endregion

// #region Events

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
 * Handle day mouse over event for tippy tooltip
 *
 * @param $event - The mouse event
 * @param day - The day to show tooltip for
 */
const onDayMouseOver = ($event: MouseEvent, day: IHeatmapDay): void => {
  tippyUtils?.lazyLoadTooltip($event, day);
};

// #endregion

/**
 * Update the heatmap data based on the options
 */
const updateHeatmapData = (): void => {
  calendarUtils = new CalendarUtils(mergedOptions.value);
  defaultOptions.i18n!.months = calendarUtils.getLocalizedMonthNames(
    mergedOptions.value.locale
  );
  mergedOptions.value.i18n!.months = calendarUtils.getLocalizedMonthNames(
    mergedOptions.value.locale
  );
  defaultOptions.i18n!.weekdays = calendarUtils.getLocalizedWeekdayNames(
    mergedOptions.value.locale
  );
  mergedOptions.value.i18n!.weekdays = calendarUtils.getLocalizedWeekdayNames(
    mergedOptions.value.locale
  );

  emptyCellStyle.value = {
    height: (mergedOptions.value.cellSize || 15) + 'px',
    width: (mergedOptions.value.cellSize || 15) + 'px',
    ...mergedOptions.value.overWritedDayStyle,
  };

  if (mergedOptions.value.colors?.length) {
    levels.value = mergedOptions.value.colors.length;
  } else {
    levels.value = 5;
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
    firstWeekOffsetDays.value =
      calendarUtils.calculateFirstWeekOffset(startDate);
    lastWeekOffsetDays.value = calendarUtils.calculateLastWeekOffset(endDate);
  }
};

/**
 * Watch for changes in the options and update the heatmap data
 */
watch(() => mergedOptions.value, updateHeatmapData, { immediate: true });

onMounted(() => {
  // tippy utils
  tippyUtils = new DayTippyUtils(mergedOptions.value);
  tippyUtils.init();

  emptyCellStyle.value = {
    ...mergedOptions.value.overWritedDayStyle,
  };
});

onUnmounted(() => {
  tippyUtils?.destroy();
});
</script>

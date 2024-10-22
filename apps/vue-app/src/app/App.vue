<template>
  <div class="flex flex-col w-full h-full dark:bg-gray-900">
    <div class="flex flex-row gap-5">
      <select
        v-model="selectedYear"
        class="w-6/12 p-2 m-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
      >
        <option v-for="(year, index) in years" :key="index">
          {{ year }}
        </option>
      </select>

      <select
        class="w-6/12 p-2 m-2 text-gray-800 border border-gray-300 rounded-md dark:text-gray-200 dark:border-gray-700 dark:bg-gray-700"
        @change="onColorVariantChange($event)"
      >
        <option value="default">Default</option>
        <option
          v-for="(variant, index) in heatmapColorsVariants"
          :key="index"
          class="text-gray-800"
          :class="variant[heatmapColorsVariants.length - 1].className"
        >
          {{ variant[0].className }}
        </option>
      </select>
    </div>

    <div class="flex flex-col items-start justify-start gap-3 p-5">
      <span> Yearly </span>

      <NxCalendarHeatmap
        :options="yearlyOptions"
        class="p-4 bg-white rounded-md dark:bg-gray-800"
      />

      <span> Monthly </span>

      <div
        class="flex flex-row p-4 bg-white rounded-md gap-x-2 dark:bg-gray-800"
      >
        <NxCalendarHeatmap
          v-for="(month, index) in months"
          :key="index"
          :options="montlyOptions"
        />
      </div>

      <span> Weekly </span>

      <NxCalendarHeatmap
        :options="weeklyOptions"
        class="p-4 bg-white rounded-md dark:bg-gray-800"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
  IHeatmapColor,
  ICalendarHeatmapOptions,
} from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';

const startDate = ref('1998-01-01');
const cellSize = 15;

const heatmapColorsVariants: IHeatmapColor[][] = [
  // variant 1
  <IHeatmapColor[]>[
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      isDefault: true,
      className: 'custom-variant1-level-0',
    },
    { min: 1, max: 10, isDefault: false, className: 'custom-variant1-level-1' },
    {
      min: 10,
      max: 30,
      isDefault: false,
      className: 'custom-variant1-level-2',
    },
    {
      min: 30,
      max: 40,
      isDefault: false,
      className: 'custom-variant1-level-3',
    },
    {
      min: 40,
      max: 50,
      isDefault: false,
      className: 'custom-variant1-level-4',
    },
    {
      min: 50,
      max: Number.POSITIVE_INFINITY,
      isDefault: false,
      className: 'custom-variant1-level-5',
    },
  ],
  // variant 2
  <IHeatmapColor[]>[
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      isDefault: true,
      className: 'custom-variant2-level-0',
    },
    { min: 1, max: 10, isDefault: false, className: 'custom-variant2-level-1' },
    {
      min: 10,
      max: 30,
      isDefault: false,
      className: 'custom-variant2-level-2',
    },
    {
      min: 30,
      max: 40,
      isDefault: false,
      className: 'custom-variant2-level-3',
    },
    {
      min: 40,
      max: 50,
      isDefault: false,
      className: 'custom-variant2-level-4',
    },
    {
      min: 50,
      max: Number.POSITIVE_INFINITY,
      isDefault: false,
      className: 'custom-variant2-level-5',
    },
  ],
  // variant 3
  <IHeatmapColor[]>[
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      isDefault: true,
      className: 'custom-variant3-level-0',
    },
    { min: 1, max: 10, isDefault: false, className: 'custom-variant3-level-1' },
    {
      min: 10,
      max: 30,
      isDefault: false,
      className: 'custom-variant3-level-2',
    },
    {
      min: 30,
      max: 40,
      isDefault: false,
      className: 'custom-variant3-level-3',
    },
    {
      min: 40,
      max: 50,
      isDefault: false,
      className: 'custom-variant3-level-4',
    },
    {
      min: 50,
      max: Number.POSITIVE_INFINITY,
      isDefault: false,
      className: 'custom-variant3-level-5',
    },
  ],
  // variant 4
  <IHeatmapColor[]>[
    {
      min: Number.NEGATIVE_INFINITY,
      max: 0,
      isDefault: true,
      className: 'custom-variant4-level-0',
    },
    { min: 1, max: 10, isDefault: false, className: 'custom-variant4-level-1' },
    {
      min: 10,
      max: 30,
      isDefault: false,
      className: 'custom-variant4-level-2',
    },
    {
      min: 30,
      max: 40,
      isDefault: false,
      className: 'custom-variant4-level-3',
    },
    {
      min: 40,
      max: 50,
      isDefault: false,
      className: 'custom-variant4-level-4',
    },
    {
      min: 50,
      max: Number.POSITIVE_INFINITY,
      isDefault: false,
      className: 'custom-variant4-level-5',
    },
  ],
];

const selectedColorVariant = ref();

const months = Array.from({ length: 12 }, (_, i) => {
  const firstDayOfMonth = DateTime.local().set({ month: i + 1, day: 1 });

  return firstDayOfMonth.toISODate();
});

const years = ref(Array.from({ length: 30 }, (_, i) => i + 1998).reverse());

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};

const selectedYear = ref(years.value[0]);

const yearlyOptions = ref({
    type: HeatMapCalendarType.YEARLY,
    startDate: startDate,
    cellSize: cellSize,
    hideEmptyDays: false,
    colors: selectedColorVariant,
    onClick: onDayClick,
  }),
  montlyOptions = ref({
    type: HeatMapCalendarType.MONTHLY,
    startDate: startDate,
    cellSize: cellSize,
    onClick: onDayClick,
  }),
  weeklyOptions = ref({
    type: HeatMapCalendarType.WEEKLY,
    startDate: startDate,
    cellSize: cellSize,
    onClick: onDayClick,
  });

watch(selectedYear, () => {
  startDate.value = `${selectedYear.value}-01-01`;

  yearlyOptions.value = {
    ...yearlyOptions.value,
    startDate: startDate.value,
  };
});

watch(selectedColorVariant, () => {
  yearlyOptions.value = {
    ...yearlyOptions.value,
    colors: selectedColorVariant.value,
  };

  montlyOptions.value = <ICalendarHeatmapOptions | any>{
    ...montlyOptions.value,
    colors: selectedColorVariant.value,
  };

  weeklyOptions.value = <ICalendarHeatmapOptions | any>{
    ...weeklyOptions.value,
    colors: selectedColorVariant.value,
  };
});

const onColorVariantChange = (event: any) => {
  const colorVariant = heatmapColorsVariants.find(
    (colorVariant: IHeatmapColor[]) =>
      colorVariant.find(
        (color: IHeatmapColor) => color.className === event.target.value
      )
  );

  if (colorVariant) {
    selectedColorVariant.value = colorVariant;
  } else {
    selectedColorVariant.value = [];
  }
};
</script>

<style scoped lang="scss">
@import '../../../../libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss';
</style>

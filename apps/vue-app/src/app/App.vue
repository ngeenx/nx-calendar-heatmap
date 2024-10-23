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

    <div class="flex flex-col items-start justify-start">
      <YearlyView
        :selected-color-variant="selectedColorVariant"
        :selected-year="Number(selectedYear)"
      />

      <MonthlyView
        :selected-color-variant="selectedColorVariant"
        :selected-year="Number(selectedYear)"
      />

      <WeeklyView
        :selected-color-variant="selectedColorVariant"
        :selected-year="Number(selectedYear)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import YearlyView from './components/YearlyView.vue';
import MonthlyView from './components/MonthlyView.vue';
import WeeklyView from './components/WeeklyView.vue';

import { IHeatmapColor } from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';

const startDate = ref(DateTime.now().startOf('year'));

const selectedColorVariant = ref();
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

const years = ref<number[]>(
  Array.from({ length: 30 }, (_, i) => i + 1998).reverse()
);
const selectedYear = ref(years.value[0]);

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

watch(selectedYear, () => {
  startDate.value = DateTime.fromJSDate(
    new Date(`${selectedYear.value}-01-01`)
  ) as any;
});
</script>

<style scoped lang="scss">
@import '../../../../libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss';
</style>

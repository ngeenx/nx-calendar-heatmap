<template>
  <div class="flex flex-col">
    <select
      v-model="selectedYear"
      class="p-2 m-2 border border-gray-300 rounded-md"
    >
      <option v-for="(year, index) in years" :key="index">
        {{ year }}
      </option>
    </select>

    <div class="flex flex-col items-start justify-start gap-3 p-5">
      <span> Yearly </span>

      <NxCalendarHeatmap
        :options="{
          type: HeatMapCalendarType.YEARLY,
          startDate: startDate,
          cellSize: cellSize,
          hideEmptyDays: false,
          onClick: onDayClick,
        }"
        class="p-4 bg-white rounded-md"
      />

      <span> Monthly </span>

      <div class="flex flex-row p-4 bg-white rounded-md gap-x-2">
        <NxCalendarHeatmap
          v-for="(month, index) in months"
          :key="index"
          :options="{
            type: HeatMapCalendarType.MONTHLY,
            startDate: month,
            cellSize: cellSize,
            onClick: onDayClick,
          }"
        />
      </div>

      <span> Weekly </span>

      <NxCalendarHeatmap
        :options="{
          type: HeatMapCalendarType.WEEKLY,
          startDate: startDate,
          cellSize: cellSize,
          onClick: onDayClick,
        }"
        class="p-4 bg-white rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
} from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime } from 'luxon';
import { ref, watch } from 'vue';

const startDate = ref('1998-01-01');
const cellSize = 15;

const heatmapColors = [{ min: 0, max: 0, color: '#FFFFFF' }];

const months = Array.from({ length: 12 }, (_, i) => {
  const firstDayOfMonth = DateTime.local().set({ month: i + 1, day: 1 });
  return firstDayOfMonth.toISODate();
});

const years = ref(Array.from({ length: 30 }, (_, i) => i + 1998).reverse());

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};

const selectedYear = ref(years.value[0]);

watch(selectedYear, () => {
  startDate.value = `${selectedYear.value}-01-01`;
});
</script>

<style scoped lang="scss">
@import '../../../../libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss';
</style>

<template>
  <div class="flex flex-col items-start justify-start p-12 gap-7">
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
</template>

<script setup lang="ts">
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
} from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime } from 'luxon';
import { ref } from 'vue';

const startDate = ref('1998-01-01');
const cellSize = 15;

const heatmapColors = [{ min: 0, max: 0, color: '#FFFFFF' }];

const months = Array.from({ length: 12 }, (_, i) => {
  const firstDayOfMonth = DateTime.local().set({ month: i + 1, day: 1 });
  return firstDayOfMonth.toISODate();
});

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};
</script>

<style scoped lang="scss">
@import '../../../../libs/utils/nx-calendar-heatmap-utils/src/styles/app.component.scss';
</style>

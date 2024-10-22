<template>
  <div class="flex flex-col items-start justify-start gap-5 p-20">
    <span>
      {{ startDate }}
    </span>

    <NxCalendarHeatmap
      :options="{
        type: 'yearly',
        startDate: startDate,
        cellSize: cellSize,
        hideEmptyDays: false,
        onClick: onDayClick,
      }"
    />

    <div class="flex flex-row">
      <NxCalendarHeatmap
        v-for="(month, index) in months"
        :key="index"
        :options="{
          type: 'monthly',
          startDate: month,
          cellSize: cellSize,
          onClick: onDayClick,
        }"
      />
    </div>

    <NxCalendarHeatmap
      :options="{
        type: 'weekly',
        startDate: startDate,
        cellSize: cellSize,
        onClick: onDayClick,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import { IHeatmapDay } from '@ngeenx/nx-calendar-heatmap-utils';
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

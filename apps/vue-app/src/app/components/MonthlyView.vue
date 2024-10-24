<template>
  <div class="flex flex-col items-start justify-start gap-3 p-5">
    <span> Monthly </span>

    <div
      class="flex flex-row flex-wrap gap-5 p-4 bg-white rounded-md dark:bg-gray-800"
    >
      <NxCalendarHeatmap
        v-for="(_heatmapDataMonthly, index) in heatmapData"
        :key="index"
        :options="{
          ...options,
          startDate: months[index],
        }"
        :heatmap-data="_heatmapDataMonthly"
        class="p-4 border border-gray-500 rounded-md"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
  IHeatmapLevels,
} from '@ngeenx/nx-calendar-heatmap-utils';
import { DateTime } from 'luxon';
import { onMounted, ref, watch } from 'vue';

/**
 * Component props
 */
const props = defineProps({
  selectedColorVariant: {
    type: Array as () => IHeatmapColor[],
    default: () => [],
  },
  selectedYear: {
    type: Number,
    default: () => {
      return DateTime.now().year;
    },
  },
});

const startDate = ref(DateTime.now().startOf('year'));
const heatmapData = ref<IHeatmapDay[][]>([]);

let months = Array.from(
  { length: 12 },
  (_, i): DateTime => DateTime.local().set({ month: i + 1, day: 1 })
);

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};

const options = ref<ICalendarHeatmapOptions>({
  type: HeatMapCalendarType.MONTHLY,
  startDate: startDate.value,
  cellSize: 15,
  hideEmptyDays: false,
  colors: props.selectedColorVariant,
  onClick: onDayClick,
  heatmapLevels: <IHeatmapLevels>{
    direction: 'left',
    display: false,
  },
});

const generateHeatmapData = (startDate: DateTime) => {
  let endDate: DateTime = startDate.endOf('month');

  const daysBetween = Math.floor(endDate.diff(startDate, 'days').days);
  const heatmap = [];

  let currentDate = startDate;

  for (let i = 0; i <= daysBetween; i++) {
    const day: IHeatmapDay = {
      date: currentDate,
      count: Math.floor(Math.random() * 101),
    };

    heatmap.push(day);

    currentDate = currentDate.plus({ days: 1 });
  }

  return heatmap;
};

watch(
  () => props.selectedYear,
  () => {
    startDate.value = DateTime.fromJSDate(
      new Date(`${props.selectedYear}-01-01`)
    ) as any;

    options.value = {
      ...options.value,
      startDate: startDate.value,
    };

    months = Array.from(
      { length: 12 },
      (_, i): DateTime =>
        DateTime.local().set({
          year: Number(props.selectedYear),
          month: i + 1,
          day: 1,
        })
    );

    heatmapData.value = months.map((firstDayOfMonth: DateTime) => {
      return generateHeatmapData(firstDayOfMonth);
    });
  }
);

watch(
  () => props.selectedColorVariant,
  () => {
    options.value = {
      ...options.value,
      colors: props.selectedColorVariant,
    };
  }
);

onMounted(() => {
  heatmapData.value = months.map((firstDayOfMonth: DateTime) => {
    return generateHeatmapData(firstDayOfMonth);
  });
});
</script>

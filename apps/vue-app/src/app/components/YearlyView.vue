<template>
  <div class="flex flex-col items-start justify-start gap-3 p-5">
    <span> Yearly </span>

    <NxCalendarHeatmap
      :options="options"
      :heatmap-data="heatmapData"
      class="p-4 bg-white rounded-md dark:bg-gray-800"
    />
  </div>
</template>

<script setup lang="ts">
// vue
import { onMounted, ref, watch } from 'vue';

// libs
import { NxCalendarHeatmap } from '@ngeenx/nx-vue-calendar-heatmap';
import {
  IHeatmapDay,
  HeatMapCalendarType,
  ICalendarHeatmapOptions,
  IHeatmapColor,
} from '@ngeenx/nx-calendar-heatmap-utils';

// third party
import { DateTime } from 'luxon';

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
const heatmapData = ref<IHeatmapDay[]>([]);

const onDayClick = (day: IHeatmapDay) => {
  console.log(`Clicked on ${day.date} with value ${day.count}`);
};

const options = ref<ICalendarHeatmapOptions>({
  type: HeatMapCalendarType.YEARLY,
  startDate: startDate.value,
  cellSize: 15,
  hideEmptyDays: false,
  colors: props.selectedColorVariant,
  onClick: onDayClick,
});

const generateHeatmapData = (startDate: DateTime) => {
  let endDate: DateTime = startDate.endOf('year');

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
  }
);

watch(
  () => props.selectedColorVariant,
  () => {
    options.value = {
      ...options.value,
      colors: props.selectedColorVariant,
    };

    heatmapData.value = generateHeatmapData(startDate.value);
  }
);

onMounted(() => {
  heatmapData.value = generateHeatmapData(startDate.value);
});
</script>

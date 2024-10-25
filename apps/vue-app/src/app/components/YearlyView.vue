<template>
  <div class="flex flex-col items-start justify-start gap-3 p-5">
    <span> Yearly </span>

    <NxCalendarHeatmap
      :options="options"
      :heatmap-data="heatmapData"
      class="p-4 border border-gray-500 rounded-md dark:bg-gray-800"
    >
      <template #footerContent>
        <a href="#" class="text-blue-400"> Learn how we count contributions </a>
      </template>
    </NxCalendarHeatmap>
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
  HeatmapLevelsDirection,
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
  selectedHeatmapLevelState: {
    type: Boolean,
    default: () => {
      return true;
    },
  },
  selectedLocale: {
    type: String,
    default: () => {
      return 'en';
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
  locale: props.selectedLocale,
  colors: props.selectedColorVariant,
  heatmapLegend: {
    display: props.selectedHeatmapLevelState,
    direction: HeatmapLevelsDirection.RIGHT,
  },
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
  () => [
    props.selectedYear,
    props.selectedColorVariant,
    props.selectedHeatmapLevelState,
    props.selectedLocale,
  ],
  () => {
    startDate.value = DateTime.fromJSDate(
      new Date(`${props.selectedYear}-01-01`)
    ) as any;

    heatmapData.value = generateHeatmapData(startDate.value);

    options.value = {
      ...options.value,
      startDate: startDate.value,
      colors: props.selectedColorVariant,
      locale: props.selectedLocale,
      heatmapLegend: {
        ...options.value.heatmapLegend,
        display: props.selectedHeatmapLevelState,
      },
    };
  }
);

onMounted(() => {
  heatmapData.value = generateHeatmapData(startDate.value);
});
</script>

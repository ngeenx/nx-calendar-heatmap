<template>
  <div
    class="heatmap-levels"
    :class="{
      left: props.options.hetmapLevelDirection === 'left',
      right: props.options.hetmapLevelDirection === 'right',
    }"
  >
    <!-- Less -->
    <span>
      {{ props.options.i18n?.less }}
    </span>

    <!-- Level -->
    <button
      v-for="(color, index) in colors"
      :key="index"
      class="day"
      :style="{
        width: (props.options.cellSize || 15) - 2 + 'px',
        height: (props.options.cellSize || 15) - 2 + 'px',
      }"
      :class="getDayClass(color.min)"
    />

    <!-- More -->
    <span>
      {{ props.options.i18n?.more }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  ICalendarHeatmapOptions,
  IHeatmapColor,
} from '@ngeenx/nx-calendar-heatmap-utils';

const colors = ref<IHeatmapColor[]>([]);

const props = defineProps({
  options: {
    type: Object as () => ICalendarHeatmapOptions,
    default: () => ({}),
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  range: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 100,
  },
  levels: {
    type: Number,
    default: 5,
  },
});

const updateLevelMap = (): void => {
  if (props.options.colors?.length) {
    colors.value = props.options.colors;
  }

  if (!props.options.colors?.length) {
    colors.value = Array.from({ length: props.levels }, (_, i) => {
      return <IHeatmapColor>{
        min: i * props.step,
        max: i * props.step,
        className: `level-${i}`,
      };
    });
  }
};

const getDayClass = (value: number | undefined): string => {
  // if we are using default colors
  if (!props.options.colors?.length) {
    if (value === 0 || value === undefined) {
      return 'level-0';
    }

    for (let i = 0; i < props.levels; i++) {
      if (value <= props.min + props.step * (i + 1)) {
        return `level-${i + 1}`;
      }
    }

    return 'level-0';
  }

  // if we are using custom colors and value is not undefined (empty days values are undefined)
  if (value !== undefined) {
    for (const color of props.options.colors) {
      if (color.min && color.max && value >= color.min && value <= color.max) {
        return color.className;
      }
    }
  }

  // find default color
  const defaultColor =
    props.options.colors?.find((color: IHeatmapColor) => color.isDefault) ||
    props.options.colors?.[0];

  if (defaultColor) {
    return defaultColor.className;
  }

  return 'level-0';
};

onMounted(() => {
  updateLevelMap();
});
</script>

<style scoped lang="scss">
@import '../../../../utils/nx-calendar-heatmap-utils/src/styles/calendar-heatmap.scss';
</style>

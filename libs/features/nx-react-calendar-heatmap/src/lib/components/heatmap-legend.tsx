import React, { useEffect, useState, useCallback } from 'react';
import {
  ICalendarHeatmapOptions,
  IHeatmapColor,
  LevelsTippyUtils,
} from '@ngeenx/nx-calendar-heatmap-utils';

interface NxHeatmapLegendProps {
  options?: ICalendarHeatmapOptions;
  min?: number;
  max?: number;
  range?: number;
  step?: number;
  levels?: number;
}

const NxHeatmapLegend: React.FC<NxHeatmapLegendProps> = ({
  options = {} as ICalendarHeatmapOptions,
  min = 0,
  max = 100,
  range = 100,
  step = 100,
  levels = 5,
}) => {
  const [colors, setColors] = useState<IHeatmapColor[]>([]);
  let tippyUtils: LevelsTippyUtils | undefined;

  const updateLevelMap = useCallback(() => {
    if (options.colors?.length) {
      setColors(options.colors);
    } else {
      const generatedColors = Array.from({ length: levels }, (_, i) => ({
        min: i * step,
        max: i * step,
        className: `level-${i}`,
      })) as IHeatmapColor[];
      setColors(generatedColors);
    }
  }, [options.colors, levels, step]);

  const getDayClass = useCallback(
    (value: number | undefined): string => {
      if (!options.colors?.length) {
        if (value === 0 || value === undefined) {
          return 'level-0';
        }

        for (let i = 0; i < levels; i++) {
          if (value <= min + step * (i + 1)) {
            return `level-${i + 1}`;
          }
        }
        return 'level-0';
      }

      if (value !== undefined) {
        for (const color of options.colors) {
          if (
            color.min &&
            color.max &&
            value >= color.min &&
            value <= color.max
          ) {
            return color.className;
          }
        }
      }

      const defaultColor =
        options.colors?.find((color: IHeatmapColor) => color.isDefault) ||
        options.colors?.[0];
      return defaultColor ? defaultColor.className : 'level-0';
    },
    [options.colors, min, step, levels]
  );

  useEffect(() => {
    updateLevelMap();

    tippyUtils = new LevelsTippyUtils(options as ICalendarHeatmapOptions);
    tippyUtils.init();

    return () => {
      tippyUtils?.destroy();
    };
  }, [options, updateLevelMap]);

  const onLegendLevelMouseOver = useCallback(
    (event: MouseEvent, color: IHeatmapColor): void => {
      tippyUtils?.lazyLoadTooltip(event, color);
    },
    [tippyUtils]
  );

  return (
    <div
      className={`heatmap-levels ${
        options.heatmapLegend?.direction === 'left' ? 'left' : 'right'
      }`}
    >
      <span>{options.i18n?.less}</span>

      {colors.map((color: IHeatmapColor, index) => (
        <button
          key={index}
          className={`day ${getDayClass(color.min)}`}
          style={{
            width: `${(options.cellSize || 15) - 2}px`,
            height: `${(options.cellSize || 15) - 2}px`,
          }}
          onMouseOver={(event: React.MouseEvent<HTMLButtonElement>) =>
            onLegendLevelMouseOver(event.nativeEvent, color)
          }
        />
      ))}

      <span>{options.i18n?.more}</span>
    </div>
  );
};

export default NxHeatmapLegend;

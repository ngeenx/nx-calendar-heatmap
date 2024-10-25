import { HeatMapCalendarType } from "../../models/calendar-heatmap";
import { CalendarUtils } from "./calendar.utils";
import { DateTime } from "luxon";

describe("CalendarUtils", () => {
  let utils!: CalendarUtils;

  // #region calculateFirstWeekOffset tests

  it("should return correct number of days in first week for 2024 with yearly calendar type", () => {
    const date = DateTime.local(2024, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.YEARLY,
    });

    const daysInFirstWeek = utils.calculateFirstWeekOffset(date);

    /**
     * 2024 has 0 empty cells in the first week
     */
    expect(daysInFirstWeek.length).toBe(0);
  });

  it("should return correct number of days in first week for 2025 with yearly calendar type", () => {
    const date = DateTime.local(2025, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.YEARLY,
    });

    const daysInFirstWeek = utils.calculateFirstWeekOffset(date);

    /**
     * 2025 has 2 empty cells in the first week
     * because 2024 is ended on 31-12-2024 tuesday.
     * In this case 01-01-2025 must start on wednesday.
     * So, we have 2 empty cells for the first week.
     */
    expect(daysInFirstWeek.length).toBe(2);
  });

  it("should return correct number of days in first week for 2024 with monthly calendar type", () => {
    const date = DateTime.local(2024, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.MONTHLY,
    });

    const daysInFirstWeek = utils.calculateFirstWeekOffset(date);

    /**
     * 2024 has 0 empty cells in the first week
     */
    expect(daysInFirstWeek.length).toBe(0);
  });

  it("should return correct number of days in first week for 2025 with monthly calendar type", () => {
    const date = DateTime.local(2025, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.MONTHLY,
    });

    const daysInFirstWeek = utils.calculateFirstWeekOffset(date);

    /**
     * 2025 has 2 empty cells in the first week
     * because 2024 is ended on 31-12-2024 tuesday.
     * In this case 01-01-2025 must start on wednesday.
     * So, we have 2 empty cells for the first week.
     */
    expect(daysInFirstWeek.length).toBe(2);
  });

  it("should return correct number of days in first week for 2024 any month with monthly calendar type", () => {
    const date = DateTime.local(2024, 2, 1),
      expectedValues = [0, 3, 4, 0, 2, 5, 0, 3, 6, 1, 4, 6];

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.MONTHLY,
    });

    const result = Array.from({ length: 12 }).map(
      (_, i) =>
        utils.calculateFirstWeekOffset(DateTime.local(2024, i + 1, 1)).length
    );

    expect(result).toStrictEqual(expectedValues);
  });

  // #endregion

  // #region calculateLastWeekOffset tests

  it("should return correct number of days in last week for 2024 with yearly calendar type", () => {
    const date = DateTime.local(2024, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.YEARLY,
    });

    const emptyLastWeekdays = utils.calculateLastWeekOffset(date.endOf("year"));

    /**
     * 2024 has 5 empty cells in the last week
     */
    expect(emptyLastWeekdays.length).toBe(5);
  });

  it("should return correct number of days in last week for 2025 with yearly calendar type", () => {
    const date = DateTime.local(2025, 1, 1);

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.YEARLY,
    });

    const emptyLastWeekdays = utils.calculateLastWeekOffset(date.endOf("year"));

    /**
     * 2025 has 4 empty cells in the last week
     * because 2024 is ended on 31-12-2024 tuesday.
     * In this case 01-12-2025 must start on wednesday.
     * So, we have 4 empty cells for the last week.
     */
    expect(emptyLastWeekdays.length).toBe(4);
  });

  it("should return correct number of days in last week for december 2024 with monthly calendar type", () => {
    const date = DateTime.local(2024, 1, 1).endOf("year").startOf("month");

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.MONTHLY,
    });

    const emptyLastWeekdays = utils.calculateLastWeekOffset(
      date.endOf("month")
    );

    /**
     * 2024 has 0 empty cells in the last week
     */
    expect(emptyLastWeekdays.length).toBe(5);
  });

  it("should return correct number of days in last week for december 2025 with monthly calendar type", () => {
    const date = DateTime.local(2025, 1, 1).endOf("year").startOf("month");

    utils = new CalendarUtils({
      startDate: date,
      type: HeatMapCalendarType.MONTHLY,
    });

    const emptyLastWeekdays = utils.calculateLastWeekOffset(
      date.endOf("month")
    );

    /**
     * 2025 has 2 empty cells in the last week
     * because 2024 is ended on 31-12-2024 tuesday.
     * In this case 01-01-2025 must start on wednesday.
     * So, we have 2 empty cells for the last week.
     */
    expect(emptyLastWeekdays.length).toBe(4);
  });

  it("should return correct number of days in last week for 2024 any month with monthly calendar type", () => {
    const expectedValues = [4, 3, 0, 5, 2, 0, 4, 1, 6, 3, 1, 5];

    const result = Array.from({ length: 12 }).map((_, i) => {
      const date = DateTime.local(2024, i + 1, 1);

      utils = new CalendarUtils({
        startDate: date,
        type: HeatMapCalendarType.MONTHLY,
      });

      return utils.calculateLastWeekOffset(date.endOf("month")).length;
    });

    expect(result).toStrictEqual(expectedValues);
  });

  // #endregion

  // #region getLocalizedMonthNames tests

  it("should return correct month names for english", () => {
    const englishMonthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "en",
    });

    const monthNames = utils.getLocalizedMonthNames();

    expect(monthNames).toStrictEqual(englishMonthNames);
  });

  it("should return correct month names for turkish", () => {
    const turkishMonthNames = [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "tr",
    });

    const monthNames = utils.getLocalizedMonthNames();

    expect(monthNames).toStrictEqual(turkishMonthNames);
  });

  it("should return correct month names for japanese", () => {
    const turkishMonthNames = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "ja",
    });

    const monthNames = utils.getLocalizedMonthNames();

    expect(monthNames).toStrictEqual(turkishMonthNames);
  });

  it("should return correct month names for french", () => {
    const turkishMonthNames = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "fr",
    });

    const monthNames = utils.getLocalizedMonthNames();

    expect(monthNames).toStrictEqual(turkishMonthNames);
  });

  // #endregion

  // #region getLocalizedWeekdayNames tests

  it("should return correct weekday names for english", () => {
    const englishWeekdayNames = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
    });

    const weekdayNames = utils.getLocalizedWeekdayNames();

    expect(weekdayNames).toStrictEqual(englishWeekdayNames);
  });

  it("should return correct weekday names for turkish", () => {
    const englishWeekdayNames = [
      "Pzt",
      "Sal",
      "Çar",
      "Per",
      "Cum",
      "Cmt",
      "Paz",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "tr",
    });

    const weekdayNames = utils.getLocalizedWeekdayNames();

    expect(weekdayNames).toStrictEqual(englishWeekdayNames);
  });

  it("should return correct weekday names for french", () => {
    const englishWeekdayNames = [
      "lun.",
      "mar.",
      "mer.",
      "jeu.",
      "ven.",
      "sam.",
      "dim.",
    ];

    utils = new CalendarUtils({
      startDate: DateTime.now(),
      type: HeatMapCalendarType.YEARLY,
      locale: "fr",
    });

    const weekdayNames = utils.getLocalizedWeekdayNames();

    expect(weekdayNames).toStrictEqual(englishWeekdayNames);
  });

  // #endregion
});

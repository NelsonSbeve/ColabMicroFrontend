import { HolidayPeriod } from "./holidayPeriod";

export interface Holiday {
    id: number;
    _colabId: number;
    _colabName?: string;
    _holidayPeriod: HolidayPeriod;
}
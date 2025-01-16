import { DayOfWeek } from "../enums/dayOfWeek";

export class Lessons {
    constructor(
        public user_id: number,
        public lesson: string,
        public lesson_time: Date,
        public day_of_week: DayOfWeek,
    ) {}
}
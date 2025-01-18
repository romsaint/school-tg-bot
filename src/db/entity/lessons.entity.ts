import { DayOfWeek } from "../enums/dayOfWeek";

export class Lessons {
    constructor(
        public user_id: number,
        public lesson: string,
        public lesson_time: number,
        public day_of_week: DayOfWeek,
        public homework: string,
        public id: number,
    ) {}
}
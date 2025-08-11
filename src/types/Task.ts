export type Task = {
	id: string;
	name: string;
	duration: number;
	predecessors: string[];
	earlyStart?: number;
	earlyFinish?: number;
	lateStart?: number;
	lateFinish?: number;
	slack?: number;
};

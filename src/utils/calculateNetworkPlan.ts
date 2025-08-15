import type { Task } from '../types/Task';

// 1. CSV in Tasks umwandeln
export function calculateNetworkPlan(raw: unknown[][]): Task[] {
	const tasks: Task[] = raw.map((row) => ({
		id: String(row[0]),
		name: String(row[1]),
		duration: Number(row[2]),
		predecessors:
			String(row[3]) === '-'
				? []
				: String(row[3])
						.split(',')
						.map((p) => p.trim()),
		earlyStart: 0,
		earlyFinish: 0,
		lateStart: 0,
		lateFinish: 0,
		slack: 0
	}));

	// Lookup Map: id -> Task
	const lookup: Record<string, Task> = Object.fromEntries(tasks.map((t) => [t.id, t]));

	// 2. Vorwärtsrechnung: earlyStart und earlyFinish berechnen
	for (const task of tasks) {
		if (task.predecessors.length === 0) {
			task.earlyStart = 0;
		} else {
			// max(earlyFinish der Vorgänger)
			const predsEarlyFinish = task.predecessors
				.map((p) => lookup[p]?.earlyFinish)
				.filter((ef): ef is number => ef !== undefined);
			task.earlyStart = predsEarlyFinish.length > 0 ? Math.max(...predsEarlyFinish) : 0;
		}
		task.earlyFinish = task.earlyStart + task.duration;
	}

	// 3. Rückwärtsrechnung: lateStart und lateFinish berechnen
	const maxEF = Math.max(
		...tasks.map((t) => t.earlyFinish).filter((ef): ef is number => ef !== undefined)
	);

	const hasNoSuccessor = (task: Task) => !tasks.some((t) => t.predecessors.includes(task.id));

	// Für Endknoten LateFinish = maxEF setzen
	tasks.filter(hasNoSuccessor).forEach((t) => {
		t.lateFinish = maxEF;
		t.lateStart = t.lateFinish - t.duration;
	});

	// Rückwärts durch alle Aufgaben iterieren
	for (let i = tasks.length - 1; i >= 0; i--) {
		const task = tasks[i];
		const successors = tasks.filter((t) => t.predecessors.includes(task.id));
		if (successors.length > 0) {
			const succLateStart = successors
				.map((s) => s.lateStart)
				.filter((ls): ls is number => ls !== undefined);
			task.lateFinish = succLateStart.length > 0 ? Math.min(...succLateStart) : maxEF;
			task.lateStart = task.lateFinish - task.duration;
		}
	}

	// 4. Puffer berechnen
	for (const t of tasks) {
		t.slack = (t.lateStart ?? 0) - (t.earlyStart ?? 0);
	}

	return tasks;
}

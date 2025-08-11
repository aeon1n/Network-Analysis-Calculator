<script lang="ts">
	import Preview from '../components/Preview.svelte';
	import Textinput from '../components/Textinput.svelte';
	import Upload from '../components/Upload.svelte';
	import Papa from 'papaparse';
	import type { Task } from '../types/Task';
	import { calculateNetworkPlan } from '../utils/calculateNetworkPlan';

	let fileContents = $state('');
	let parsedCsv: Papa.ParseResult<unknown> | undefined = $state();
	let tasks: Task[] = $state([]);

	function onCsvInsert(csvData: Papa.ParseResult<unknown>) {
		parsedCsv = csvData;

		if (parsedCsv?.data) {
			tasks = calculateNetworkPlan(parsedCsv.data as unknown[][]);
		}
	}

	function onCsvUpload(csvData: string) {
		fileContents = csvData;
	}
</script>

<div class="mx-auto mt-8 max-w-3xl px-8">
	<h1 class=" text-2xl font-bold">Netzplan Überprüfen</h1>
	<h3 class="mb-4">
		Überprüfen Sie Ihren Netzplan indem Sie eine Datei im CSV-Format hochladen oder geben Sie Ihren
		Netzplan in das Textfeld ein.
	</h3>
	<form>
		<Upload {onCsvUpload} />
		<Textinput {onCsvInsert} data={fileContents} />
	</form>
	<hr class="mt-8 mb-4 text-gray-200" />
	<Preview {tasks} />
</div>

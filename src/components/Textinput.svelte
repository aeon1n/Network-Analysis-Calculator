<script lang="ts">
	import Papa from 'papaparse';

	const { data, onCsvInsert } = $props<{
		data: unknown;
		onCsvInsert: (data: Papa.ParseResult<unknown>) => void;
	}>();

	let csvString = $state('');
	let csvParse: Papa.ParseResult<unknown>;

	$effect(() => {
		if (data && csvString === '') {
			csvString = data;
		}
	});

	function submitHandler(e: Event) {
		e.preventDefault();
		csvParse = Papa.parse(csvString);
		if (onCsvInsert) {
			onCsvInsert(csvParse);
		}
	}
</script>

<form class="flex flex-col items-end" onsubmit={submitHandler}>
	<textarea
		bind:value={csvString}
		name="netzplanInput"
		id="netzplanInput"
		rows="10"
		class="w-full bg-gray-100 p-2"
	></textarea>
	<button
		class="mt-2 bg-blue-500 px-6 py-3 font-bold text-white duration-200 ease-in-out hover:cursor-pointer hover:bg-blue-700"
		>Generieren</button
	>
</form>

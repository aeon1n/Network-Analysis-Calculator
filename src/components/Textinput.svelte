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

<form class="flex flex-col" onsubmit={submitHandler}>
	<h3 class="mb-1 text-lg font-bold">Tabellarischer Netzplan</h3>
	<textarea
		bind:value={csvString}
		name="netzplanInput"
		id="netzplanInput"
		rows="10"
		class="w-full bg-gray-100 p-2"
		placeholder="Vorgang;Beschreibung;Dauer;Vorgänger"
	></textarea>
	<button
		class="mt-2 self-end bg-blue-500 px-6 py-3 font-bold text-white duration-200 ease-in-out hover:cursor-pointer hover:bg-blue-700"
		>Generieren</button
	>
</form>

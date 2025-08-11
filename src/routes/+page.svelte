<script lang="ts">
	import Preview from '../components/Preview.svelte';
	import Textinput from '../components/Textinput.svelte';
	import Upload from '../components/Upload.svelte';
	import Papa from 'papaparse';

	function onCsvInsert(csvData: Papa.ParseResult<unknown>) {
		console.log(csvData);
	}
</script>

<div class="mx-auto mt-8 max-w-3xl px-8">
	<h1 class=" text-2xl font-bold">Netzplan Überprüfen</h1>
	<h3 class="mb-4">
		Überprüfen Sie Ihren Netzplan indem Sie eine Datei im CSV-Format hochladen oder in hier
		eingeben:
	</h3>
	<form>
		<Upload />
		<Textinput {onCsvInsert} />
	</form>
	<hr class="mt-8 mb-4 text-gray-200" />
	<Preview />
</div>

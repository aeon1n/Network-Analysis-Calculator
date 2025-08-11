<script lang="ts">
	const { onCsvUpload } = $props();

	let fileContent = $state('');
	let fileName = $state('');

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) {
			fileName = 'no file selected';
			return;
		}

		fileName = file.name;

		file.text().then((text) => {
			fileContent = text;
			onCsvUpload(text);
		});
	}
</script>

<form class="mb-4 flex w-full items-center justify-start">
	<div
		class="bg-gray-200 px-6 py-3 font-bold text-black duration-200 ease-in-out hover:cursor-pointer hover:bg-red-700 hover:text-white"
	>
		<label for="file" class="hover:cursor-pointer"> Datei hochladen </label>
		<input
			type="file"
			name="file"
			id="file"
			accept=".csv"
			class="hidden"
			onchange={handleFileChange}
		/>
	</div>
	<span class="ml-4">{fileName != '' ? fileName : 'no file selected'}</span>
</form>

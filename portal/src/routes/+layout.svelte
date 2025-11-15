<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Hellers Kaffees Content Portal</title>
	<meta name="description" content="Content creation portal for Hellers Kaffees" />
</svelte:head>

{@render children()}

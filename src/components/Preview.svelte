<script lang="ts">
	import { onMount } from 'svelte';
	import dagre from '@dagrejs/dagre';
	import * as d3 from 'd3';
	import type { Task } from '../types/Task';

	export let tasks: Task[] = [];
	export let criticalPath: string[] = [];
	let svgElement: SVGSVGElement | null = null;
	let direction: 'LR' | 'TB' = 'LR';

	let d3Zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
	let svgGroup: d3.Selection<SVGGElement, unknown, null, undefined>;

	function renderGraph() {
		if (!svgElement) return;

		const svg = d3.select(svgElement);
		svg.selectAll('g').remove();

		svgGroup = svg.append('g');

		d3Zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
			svgGroup.attr('transform', event.transform);
		});
		svg.call(d3Zoom);

		if (!tasks.length) return;

		const g = new dagre.graphlib.Graph();
		g.setGraph({ rankdir: direction, nodesep: 20, edgesep: 20 });
		g.setDefaultEdgeLabel(() => ({}));

		tasks.forEach((t) => {
			g.setNode(t.id, { label: t.name, width: 150, height: 80 });
		});

		tasks.forEach((t) => {
			if (t.predecessors?.length) {
				t.predecessors.forEach((p) => {
					if (p !== '-') g.setEdge(p, t.id);
				});
			}
		});

		dagre.layout(g);

		const nodesData = g.nodes().map((v) => {
			const node = g.node(v)!;
			const task = tasks.find((t) => t.id === v);
			return { id: v, x: node.x, y: node.y, width: node.width, height: node.height, task };
		});

		const edgesData = g.edges().map((e) => {
			const edge = g.edge(e)!;
			return { points: edge.points, source: e.v, target: e.w };
		});

		svgGroup
			.selectAll('.edgePath')
			.data(edgesData)
			.enter()
			.append('path')
			.attr('class', 'edgePath')
			.attr('fill', 'none')
			.attr('stroke', 'black')
			.attr('d', (d) => {
				const line = d3
					.line<{ x: number; y: number }>()
					.x((p) => p.x)
					.y((p) => p.y);
				return line(d.points);
			});

		const nodesGroup = svgGroup
			.selectAll('.node')
			.data(nodesData)
			.enter()
			.append('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${d.x - d.width / 2}, ${d.y - d.height / 2})`);

		nodesGroup
			.append('rect')
			.attr('width', (d) => d.width)
			.attr('height', (d) => d.height)
			.attr('rx', 6)
			.attr('stroke', 'black')
			.attr('fill', (d) =>
				criticalPath.includes(d.id) || d.task?.slack === 0 ? '#f87171' : '#60a5fa'
			);

		const textGroup = nodesGroup.append('g').attr('transform', `translate(10, 20)`);

		textGroup
			.append('text')
			.attr('font-size', 12)
			.attr('fill', 'white')
			.text((d) => `ID: ${d.task?.id}`);

		textGroup
			.append('text')
			.attr('y', 15)
			.attr('font-size', 12)
			.attr('fill', 'white')
			.text((d) => `Name: ${d.task?.name}`);

		textGroup
			.append('text')
			.attr('y', 30)
			.attr('font-size', 12)
			.attr('fill', 'white')
			.text((d) => `Dauer: ${d.task?.duration}`);

		const graphWidth = g.graph().width || svgElement.clientWidth;
		const graphHeight = g.graph().height || svgElement.clientHeight;
		const svgWidth = svgElement.clientWidth;
		const svgHeight = svgElement.clientHeight;

		const initialZoom = Math.min(svgWidth / graphWidth, svgHeight / graphHeight) * 0.9;
		const initialTransform = d3.zoomIdentity
			.translate(
				(svgWidth - graphWidth * initialZoom) / 2,
				(svgHeight - graphHeight * initialZoom) / 2
			)
			.scale(initialZoom);

		svg.call(d3Zoom.transform, initialTransform);
	}

	onMount(() => {
		renderGraph();
	});

	$: if (svgElement !== null && tasks.length) {
		renderGraph();
	}

	function exportSVG() {
		if (!svgElement) return;

		const serializer = new XMLSerializer();
		const source = serializer.serializeToString(svgElement);
		const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = url;
		link.download = 'netzplan.svg';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
</script>

<button onclick={exportSVG}>export svg</button>
<svg
	bind:this={svgElement}
	width="100%"
	height="100%"
	style=" border-radius: 8px; min-height: 400px; min-width: 600px;"
></svg>

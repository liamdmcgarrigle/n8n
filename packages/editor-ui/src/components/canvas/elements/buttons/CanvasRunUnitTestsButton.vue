<script setup lang="ts">
import { computed } from 'vue';

defineEmits<{
	mouseenter: [event: MouseEvent];
	mouseleave: [event: MouseEvent];
	click: [event: MouseEvent];
}>();

const props = defineProps<{
	waitingForWebhook?: boolean;
	executing?: boolean;
	disabled?: boolean;
}>();

const label = computed(() => {
	if (!props.executing) {
		return 'Run Tests';
	}

	if (props.waitingForWebhook) {
		return 'Waiting for Trigger Event';
	}

	return 'Running Tests';
});
</script>

<template>
	<N8nButton
		:loading="executing"
		:label="label"
		:disabled="disabled"
		size="large"
		icon="flask"
		type="primary"
		data-test-id="execute-workflow-button"
		@mouseenter="$emit('mouseenter', $event)"
		@mouseleave="$emit('mouseleave', $event)"
		@click.stop="$emit('click', $event)"
	/>
</template>

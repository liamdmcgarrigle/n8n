<script lang="ts" setup>
import { ref, computed } from 'vue';

const props = withDefaults(
	defineProps<{
		initialState?: boolean;
	}>(),
	{
		initialState: false,
	},
);

const emit = defineEmits<{
	(e: 'stateChange', value: boolean): void;
}>();

const isHidden = ref(props.initialState);

const toolTip = 'Hides and shows the unit test nodes. Currently does not work.';

const labelText = 'Show Test Nodes';

const onStateChange = (newState: boolean) => {
	isHidden.value = newState;
	emit('stateChange', newState);
};
</script>

<template>
	<div class="hide-unit-test-button">
		<N8nCheckbox
			v-model="isHidden"
			:label="labelText"
			:tooltip-text="toolTip"
			@update:model-value="onStateChange"
		/>
	</div>
</template>

<style lang="scss" scoped>
.hide-unit-test-button {
	display: inline-flex;
	align-items: center;
	height: 100%;
}

:deep(.n8n-checkbox) {
	margin-bottom: 0 !important;
	height: 100%;
	display: flex !important;
	align-items: center;
}

:deep(.el-checkbox) {
	height: 100%;
	display: flex;
	align-items: center;
}

:deep(.el-checkbox__input) {
	margin-top: 0;
	display: flex;
	align-items: center;
}

:deep(.el-checkbox__label) {
	padding-left: 8px;
	white-space: nowrap;
}

:deep(.n8n-input-label) {
	margin-bottom: 0;
	display: flex;
	align-items: center;
}
</style>

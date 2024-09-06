import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionType,
} from 'n8n-workflow';
import {
	testIDField,
	explanationNotice,
	keyValueRunInputs,
	jsonRunInputs,
	mockNodeInputs,
} from './UnitTestDescriptions';

export class UnitTestTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unit Test Trigger',
		name: 'unitTestTrigger',
		icon: 'file:unit_test.svg',
		group: ['trigger'],
		version: 1,
		description: 'Runs a specific unit test to test logic or your API endpoints',
		eventTriggerDescription: '',
		subtitle: '= ID: {{ $parameter["testId"] }}',
		defaults: {
			name: 'Unit Test Trigger',
		},

		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [
			...testIDField,

			...explanationNotice,

			...keyValueRunInputs,
			...jsonRunInputs,
			...mockNodeInputs,
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		//TODO: make an error if no data is passed in (right?)
		//TODO: make an error if there is no evaluation node downstream with matching ID
		//TODO: Decide whether to add index input for node additional field
		// that might be required because

		return {};
	}
}

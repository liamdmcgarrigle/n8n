import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionType,
} from 'n8n-workflow';
// eslint-disable-next-line unused-imports/no-unused-imports
import { generateTestId } from './utils';

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
			{
				displayName:
					'This node needs to be matched with a `Test Evaluation` node in order to work properly. The ID value must be the same in both',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Test ID', // The value the user sees in the UI
				name: 'testId', // The name used to reference the element UI within the code
				type: 'string',
				required: true, // Whether the field is required or not
				placeholder: 'aB3dE9Xz',
				default: '',
				description: 'The ID of the test. The Evaluation node MUST be set with the same ID.',
			},
			{
				displayName: 'Metadata',
				name: 'metadataUi',
				placeholder: 'Add Metadata',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				description: 'This is description',
				options: [
					{
						name: 'metadataValues',
						displayName: 'Metadata',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: 'Name of the metadata key to add.',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to set for the metadata key',
							},
						],
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Mock Nodes',
						name: 'mockNodes',
						placeholder: 'Add attendees',
						type: 'fixedCollection',
						// eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-json
						description:
							"You can name a node that the test will simulate. That way you can still use the format like `{{ $('Node Name').item.json['name'] }}` instead of just `{{ $json['name'] }}`.",
						default: {},
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								name: 'Mock Node Value',
								displayName: 'mockNodeValue',
								values: [
									{
										displayName: 'Node Name',
										name: 'nodeName',
										type: 'string',
										default: '',
										placeholder: 'Edit Fields',
										required: true,
										description: 'Put the name only',
									},
									{
										displayName: 'Content (JSON)',
										name: 'jsonContent',
										type: 'json',
										default: '',
										description: 'The mock JSON for this node',
									},
								],
							},
						],
					},
				],
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		return {};
	}
}

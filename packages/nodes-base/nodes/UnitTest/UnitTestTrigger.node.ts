import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionType,
} from 'n8n-workflow';
// eslint-disable-next-line unused-imports/no-unused-imports
// import {} from './utils';

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
				displayName: 'Test ID', // The value the user sees in the UI
				name: 'testId', // The name used to reference the element UI within the code
				type: 'string',
				required: true, // Whether the field is required or not
				placeholder: 'aB3dE9Xz',
				default: '',
				description: 'The ID of the test. The Evaluation node MUST be set with the same ID.',
			},
			{
				displayName:
					'You can have both key-value and JSON runs, the JSON runs will run after the key-value',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Key Value Test Data',
				name: 'testData',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Test Run',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'testDataKeyValueGroups',
						displayName: 'testData',
						default: {},
						values: [
							{
								displayName: 'Test Run',
								name: 'testRun',
								type: 'fixedCollection',
								default: {},
								placeholder: 'Add Key-Value Pair',
								typeOptions: {
									multipleValues: true,
								},
								options: [
									{
										name: 'keyValueData',
										displayName: 'Key Value Data',
										values: [
											{
												displayName: 'Key',
												name: 'key',
												type: 'string',
												default: '',
												placeholder: 'email',
												required: true,
											},
											{
												displayName: 'Value',
												name: 'value',
												type: 'string',
												default: '',
												description: 'Email@example.com',
												required: true,
											},
										],
									},
								],
							},
						],
					},
				],
			},

			{
				displayName: 'JSON Test Data',
				name: 'jsonTestData',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Test Run',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'keyValueData',
						displayName: 'Key Value Data',
						values: [
							{
								displayName: 'Test Run',
								name: 'jsonTestRun',
								type: 'json',
								default: '{\n  "keyOne": "ValueOne",\n  "keyTwo": "ValueTwo"\n}',
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
				placeholder: 'Add Additional Field',
				options: [
					{
						displayName: 'Yes or No',
						name: 'placeholder',
						type: 'boolean',
						default: true, // Initial state of the toggle
						description: 'Whether to wait for the image or not',
					},
					{
						displayName: 'Mock Nodes',
						name: 'mockNodes',
						placeholder: 'Add Mock Node',
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
										displayName: 'Index To Place Mock Node Item',
										name: 'mockNodeIndex',
										type: 'number',
										required: true,
										typeOptions: {
											minValue: 0,
											numberPrecision: 0, // no decimals allowed
										},
										default: 0,
									},
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
										default: '{\n  "keyOne": "ValueOne",\n  "keyTwo": "ValueTwo"\n}',
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
		//TODO: make an error if no data is passed in (right?)
		//TODO: make an error if there is no evaluation node downstream with matching ID
		//TODO: Decide whether to add index input for node additional field
		// that might be required because

		return {};
	}
}

import type { INodeProperties } from 'n8n-workflow';
import { cleanUpBranchDefault, failBranchDefault, throwOnFailConst } from './GenericFunctions';

// --------------------------------------------
// --------TRIGGER AND EVALUATION NODES--------
// --------------------------------------------
export const testIDField: INodeProperties[] = [
	{
		displayName: 'Test ID', // The value the user sees in the UI
		name: 'testId', // The name used to reference the element UI within the code
		type: 'string',
		required: true, // Whether the field is required or not
		placeholder: 'aB3dE9Xz',
		default: '',
		description:
			'The ID of the test. The Trigger and Evaluation node MUST be set with the same ID.',
	},
];

// --------------------------------------------
// -------------- TRIGGER NODE ----------------
// --------------------------------------------
export const explanationNotice: INodeProperties[] = [
	{
		displayName:
			'You can have both key-value and JSON runs, the JSON runs will run after the key-value',
		name: 'notice',
		type: 'notice',
		default: '',
	},
];

export const keyValueRunInputs: INodeProperties[] = [
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
];

export const jsonRunInputs: INodeProperties[] = [
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
				name: 'jsonData',
				displayName: 'JSON Data',
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
];

export const mockNodeInputs: INodeProperties[] = [
	{
		displayName: 'Mock nodes are currently not functional.',
		name: 'notice',
		type: 'notice',
		default: '',
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
				name: 'mockNodeValue',
				displayName: 'Mock Node Value',
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
];

// --------------------------------------------
// ------------- EVALUATION NODE --------------
// --------------------------------------------
export const evaluationModeSelection: INodeProperties[] = [
	{
		displayName: 'Evaluation Mode',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Comparison Evaluation',
				value: 'comparisonEvaluation',
				action: 'Comparison evaluation',
				description: 'Evaluate the input data similar to an if node, with true being a passed test',
			},
			{
				name: 'Boolean Input Evaluation',
				value: 'booleanInputComparison',
				action: 'Boolean input evaluation',
				description:
					'Evaluate a test based on the input branch, best for testing if nodes or paths taken',
			},
		],
		default: 'comparisonEvaluation',
	},
];

export const comparisonEvaluationFields: INodeProperties[] = [
	{
		displayName: 'Evaluations',
		name: 'evaluations',
		placeholder: 'Add Condition',
		type: 'filter',
		default: {},
		displayOptions: {
			show: {
				operation: ['comparisonEvaluation'],
			},
		},
		typeOptions: {
			filter: {
				// Use the user options (below) to determine filter behavior
				caseSensitive: '={{!$parameter.evaluationOptions.ignoreCase}}',
				typeValidation:
					'={{$parameter.evaluationOptions.looseTypeValidation ? "loose" : "strict"}}',
				version: 2
			},
		},
	},
	{
		displayName: 'Evaluation Options',
		name: 'evaluationOptions',
		type: 'collection',
		placeholder: 'Add option',
		default: {},
		displayOptions: {
			show: {
				operation: ['comparisonEvaluation'],
			},
		},
		options: [
			{
				displayName: 'Ignore Case',
				description: 'Whether to ignore letter case when evaluating conditions',
				name: 'ignoreCase',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Less Strict Type Validation',
				description: 'Whether to try casting value types based on the selected operator',
				name: 'looseTypeValidation',
				type: 'boolean',
				default: true,
			},
		],
	},
];

export const booleanEvaluationFields: INodeProperties[] = [
	{
		displayName:
			'This pass or fail each test based on the input into the node from the test.<br><br>This is ideal for testing if statements or which branch was taken in a workflow.',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: {
				operation: ['booleanInputComparison', 'booleanInputComparison'],
			},
		},
		default: '',
	},
];

export const additionalFields: INodeProperties[] = [
	{
		displayName: 'Additional Options',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		placeholder: 'Add Additional Field',
		options: [
			{
				displayName: 'Error on Fail?',
				name: 'errorOnFail',
				type: 'boolean',
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-boolean
				default: throwOnFailConst, // only edit this value in the `/GenericFunctions.ts` file
				description: 'Whether to throw an error when a test fails',
			},
			{
				displayName: 'Fail Branch?',
				name: 'isFailBranchEnabled',
				type: 'boolean',
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-boolean
				default: failBranchDefault, // only edit this value in the `/GenericFunctions.ts` file
				description:
					'Whether to show an on fail branch that can be used for things like notifications',
			},
			{
				displayName: 'Cleanup Branch?',
				name: 'isCleanUpBranchEnabled',
				type: 'boolean',
				// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-boolean
				default: cleanUpBranchDefault, // only edit this value in the `/GenericFunctions.ts` file
				description:
					'Whether to show a branch that runs after the test and can be used for cleanup/teardown. Example usage would be to delete additions to external services, like deleting a test contact creation.',
			},
			{
				displayName: 'Disable Workflow on Fail?',
				name: 'disableWorkflowOnFailEnabled',
				type: 'boolean',
				default: false,
				description: 'Whether to disable the workflow on fail',
			},
		],
	},
];

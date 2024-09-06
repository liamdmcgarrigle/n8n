import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionType,
	NodeOperationError,
	INodeExecutionData,
	IExecuteFunctions,
	INodeParameters,
} from 'n8n-workflow';
// eslint-disable-next-line unused-imports/no-unused-imports
// import { configuredInputs } from './utils';

//TODO: Move this to util folder
const configuredInputs = (parameters: INodeParameters) => {
	const operation = parameters.operation as string;

	if (operation === 'booleanInputComparison') {
		const inputBranches: String[] = ['pass', 'fail'] as const; // Sets the branches
		const inputArray = inputBranches.map((branch) => {
			return {
				type: `${NodeConnectionType.Main}`,
				displayName: branch,
			};
		});
		return inputArray;
	} else {
		return [
			{
				type: `${NodeConnectionType.Main}`,
			},
		];
	}
};

export class UnitTest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unit Test',
		name: 'unitTest',
		icon: 'file:unit_test.svg',
		group: ['input'],
		version: 1,
		description: 'Runs a specific unit test to test logic or your API endpoints',
		eventTriggerDescription: '',
		subtitle: '= ID: {{ $parameter["testId"] }}',
		defaults: {
			name: 'Unit Test Evaluation',
		},

		inputs: `={{(${configuredInputs})($parameter)}}`,
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Test ID', // The value the user sees in the UI
				name: 'testId', // The name used to reference the element UI within the code
				type: 'string',
				required: true, // Whether the field is required or not
				placeholder: 'aB3dE9Xz',
				default: '',
				description: 'The ID of the test. The Trigger node MUST be set with the same ID.',
			},
			{
				displayName: 'Evaluation Mode',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: 'Comparison Evaluation',
						value: 'comparisonEvaluation',
						action: 'Comparison evaluation',
						description:
							'Evaluate the input data similar to an if node, with true being a passed test',
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
			{
				displayName:
					'This pass or fail each test based on the input into the node from the test.<br><br>This is ideal for testing if statements of which branch was taken.',
				name: 'notice',
				type: 'notice',
				displayOptions: {
					show: {
						operation: ['booleanInputComparison'],
					},
				},
				default: '',
			},
			{
				displayName: 'Conditions',
				name: 'conditions',
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
						caseSensitive: '={{!$parameter.options.ignoreCase}}',
						typeValidation: '={{$parameter.options.looseTypeValidation ? "loose" : "strict"}}',
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				if (this.getNodeParameter('operation', 0) === 'createNewEvent') {
					// const calendarId = this.getNodeParameter('calendarId', itemIndex, '') as string;
					// const additionalFields = this.getNodeParameter('additionalFields', itemIndex) as IDataObject; // gets values under additionalFields
					// const isPrivate = additionalFields.isPrivate as boolean;
					// const color = additionalFields.color as string;
					// const isAllDayEvent = additionalFields.isAllDayEvent as boolean;
					// const location = additionalFields.location as string;
					// const freeBusy = additionalFields.freeBusy as number;
					// const attendees = additionalFields.attendees as IDataObject;
					// const attendeesValues = attendees?.attendeesValues as attendeeObject | undefined;
					// const url = additionalFields.url as string;
					// const timeZone = this.getNodeParameter('timeZone',itemIndex, '') as string;
					// const eventTitle = this.getNodeParameter('eventTitle',itemIndex, '') as string;
					// const startTime = moment.tz(this.getNodeParameter('startTime', itemIndex, '') as string, timeZone );
					// const endTime = moment.tz(this.getNodeParameter('endTime', itemIndex, '') as string, timeZone );
					// const description = (this.getNodeParameter('eventDescription',itemIndex, '') as string).replace(/<br>/g, "\n");

					item.json['response'] = 'hi there';
				}
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}

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
import {
	testIDField,
	evaluationModeSelection,
	comparisonEvaluationFields,
	booleanEvaluationFields,
	additionalFields,
} from './UnitTestDescriptions';
import {
	nodeInputs,
	nodeOutputs,
	cleanUpBranchDefault,
	failBranchDefault,
} from './GenericFunctions';

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
		inputs: `={{(${nodeInputs})($parameter)}}`,
		outputs: `={{(${nodeOutputs})($parameter,${cleanUpBranchDefault}, ${failBranchDefault})}}`,
		// outputs: [NodeConnectionType.Main],
		properties: [
			...testIDField,
			...evaluationModeSelection,

			...comparisonEvaluationFields,
			...booleanEvaluationFields,

			...additionalFields,
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

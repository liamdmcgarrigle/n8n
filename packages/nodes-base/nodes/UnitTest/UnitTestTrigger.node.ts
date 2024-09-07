import {
	type ITriggerFunctions,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerResponse,
	NodeConnectionType,
	IDataObject,
	INodeExecutionData,
	IExecuteFunctions,
	NodeOperationError,
} from 'n8n-workflow';
import {
	testIDField,
	explanationNotice,
	keyValueRunInputs,
	jsonRunInputs,
	mockNodeInputs,
} from './UnitTestDescriptions';
import {
	getReturnNodeJsonFromKeyValue,
	getReturnNodeJsonFromJson,
	RawKeyValueInputItems,
	ReturnNodeJson,
	RawJsonInput,
} from './GenericFunctions';

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
		// TODO: make my own trigger function that is not "manualTriggerFunction" (that wont work if i change the name)
		// TODO: make an error if no data is passed in (right?)

		// TODO: make an error if there is no evaluation node downstream with matching ID (might not work with matching id, only general node type, and probably need to use the n8n credential and api for it. Will do after i get everything else working)
		// so i can actually get the name with the api and then use `getWorkflowDataProxy(itemIndex).$node["nodeName"].parameter["parameterName"] to check another workflows value

		// Initialize the output array
		let triggerOutputData: ReturnNodeJson[] = [];

		const rawKeyValueData = (this.getNodeParameter('testData') as IDataObject)
			.testDataKeyValueGroups as RawKeyValueInputItems[];
		const rawJsonInputData = (this.getNodeParameter('jsonTestData') as IDataObject)
			.jsonData as RawJsonInput[];

		const keyValueData = getReturnNodeJsonFromKeyValue(rawKeyValueData);
		const jsonData = getReturnNodeJsonFromJson(rawJsonInputData);

		triggerOutputData.push(...keyValueData);
		triggerOutputData.push(...jsonData);

		const manualTriggerFunction = async () => {
			this.emit([this.helpers.returnJsonArray(triggerOutputData)]);
			// TODO: Replace that helper function with our own function that returns `INodeExecutionData[]`
			// thats pretty much all that does, wraps it in data and json if it isn't already. see link below
			// https://github.com/n8n-io/n8n/blob/6ea08560858c9601da33e72af8af47ab13b77266/packages/core/src/NodeExecuteFunctions.ts#L1741C73-L1741C91
		};

		return {
			manualTriggerFunction,
		};
	}
}

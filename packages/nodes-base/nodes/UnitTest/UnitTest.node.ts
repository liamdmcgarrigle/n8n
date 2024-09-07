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

		// TODO: Figure out how to filter out non test runs from running tests
		// option 1:
		// use `this.getMode()` to get execution mode. We would need to add a unit test mode to that though
		// option 2: look for the starting test ID trigger

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				item = items[itemIndex];

				// This line below is able to place values as if it was other nodes
				// problem is it only works on execution nodes and not trigger nodes
				// but that doesnt seem like it will work because it stops you if you try to run before that node with the error
				// "Referenced node is unexecuted An expression references the node 'Edit Fields', but it hasn't been executed
				// yet. Either change the expression, or re-wire your workflow to make sure that node executes first."
				// this.getWorkflowDataProxy(itemIndex).$node['Edit Fields'].json['fake'] = 'placed fake value!';
				// seems like i will need to figure out how to hack it after all

				// item.json['$data'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$data);
				// item.json['$env'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$env);
				item.json['$input'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$input);
				item.json["$node['Edit Fields']"] = JSON.stringify(
					this.getWorkflowDataProxy(itemIndex).$node['Edit Fields'],
				);

				item.json['$workflow'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$workflow);
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

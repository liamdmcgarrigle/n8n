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
	IDataObject,
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
	throwOnFailConst,
	getNodeInputsData,
	triggerWithMatchingIdRan,
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
		// requiredInputs: `={{(${nodeInputs})($parameter).length === 2 ? [0,1] : 1}}`,
		// TODO: Figure this out. super annoyed by it
		requiredInputs: [0, 1, 2],
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
		// console.log(JSON.stringify(this.getNodeInputs()));

		// TODO: Put function here to check for all of the node type unittesttrigger (not the actual name)
		// and then loop over them to see all the ids, then find the correct ID, which then i can extract the name from,
		// then i can check to see if the test trigger ran. only allow node to continue if test trigger with matching id ran
		const testId = this.getNodeParameter('testId', 0) as string;
		// if (!triggerWithMatchingIdRan(testId)){

		// }

		console.log(triggerWithMatchingIdRan(this, testId));

		// TODO: Figure out how to filter out non test runs from running tests
		// option 1:
		// use `this.getMode()` to get execution mode. We would need to add a unit test mode to that though
		// option 2: look for the starting test ID trigger
		const failedArray: INodeExecutionData[] = [];
		const cleanUpArray: INodeExecutionData[] = [];

		// console.log(`THIS IS THE DROIDS: ${JSON.stringify(this.getInputData())}`);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// set val of item for better readability
				item = items[itemIndex];

				// set throwOnFail param. is a nasty ternary to get const
				const throwOnFail = (this.getNodeParameter('additionalFields', itemIndex) as IDataObject)
					.errorOnFail
					? (this.getNodeParameter('additionalFields', itemIndex) as IDataObject).errorOnFail
					: throwOnFailConst;

				// set isCleanUpBranchEnabled param. is a nasty ternary to get const
				const isCleanUpBranchEnabled = (
					this.getNodeParameter('additionalFields', itemIndex) as IDataObject
				).isCleanUpBranchEnabled
					? ((this.getNodeParameter('additionalFields', itemIndex) as IDataObject)
							.isCleanUpBranchEnabled as boolean)
					: cleanUpBranchDefault;

				// mutable var for test pass/fail
				let pass = false;

				// evaluations for comparisonEvaluation operation
				if (this.getNodeParameter('operation', itemIndex) === 'comparisonEvaluation') {
					pass = this.getNodeParameter('evaluations', itemIndex, false, {
						extractValue: true,
					}) as boolean;

					if (!pass) {
						failedArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});

						// throw error if set to fail
						if (throwOnFail) {
							throw new NodeOperationError(this.getNode(), 'Test Failed', {
								itemIndex,
							});
						}
					}
				} // end of evaluations for comparisonEvaluation operation

				// evaluations for booleanInputComparison operation
				if (this.getNodeParameter('operation', itemIndex) === 'booleanInputComparison') {
					// this.getInputSourceData(0, inputName) // I think this is how we get the branches?
					// prob need to do that at the top of the func though
					//
					// this.getInputConnectionData()
					// console.log(this.getInputData());
					// console.log(`THIS IS THE DROIDS: ${JSON.stringify(this.getInputData())}`);
				}

				// adds each test run data to clean up branch output array, even failed runs
				if (isCleanUpBranchEnabled) {
					cleanUpArray.push({
						json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
					});
				} // end of evaluations for booleanInputComparison operation

				// console.log(`this.getInputData()() = ${JSON.stringify(this.getInputData())}`);
				// console.log(`this.this.getNodeInputs()() = ${JSON.stringify(this.getNodeInputs())}`);

				// This line below is able to place values as if it was other nodes
				// problem is it only works on execution nodes and not trigger nodes
				// but that doesnt seem like it will work because it stops you if you try to run before that node with the error
				// "Referenced node is unexecuted An expression references the node 'Edit Fields', but it hasn't been executed
				// yet. Either change the expression, or re-wire your workflow to make sure that node executes first."
				// this.getWorkflowDataProxy(itemIndex).$node['Edit Fields'].json['fake'] = 'placed fake value!';
				// seems like i will need to figure out how to hack it after all

				// item.json['$data'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$data);
				// item.json['$env'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$env);
				// item.json['$input'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$input);
				// item.json["$node['Edit Fields']"] = JSON.stringify(
				// 	this.getWorkflowDataProxy(itemIndex).$node['Edit Fields'],
				// );

				// item.json['$workflow'] = JSON.stringify(this.getWorkflowDataProxy(itemIndex).$workflow);
			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		//
		// CHECKS WHICH BRANCHES SHOULD OUTPUT
		//

		// gets current output branches
		const outputBranches = nodeOutputs(
			this.getNode().parameters,
			cleanUpBranchDefault,
			failBranchDefault,
		);

		// sets bool vars based on current output branches
		const cleanUpExists =
			outputBranches.find((item) => item.displayName === 'Clean Up') !== undefined;
		const onFailExists =
			outputBranches.find((item) => item.displayName === 'On Fail') !== undefined;

		// outputs data based on which branches are active
		if (!cleanUpExists && onFailExists) {
			return [failedArray];
		} else if (cleanUpExists && !onFailExists) {
			return [cleanUpArray];
		} else {
			return [cleanUpArray, failedArray];
		}
	}
}

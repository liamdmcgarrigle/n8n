import { NodeOperationError } from 'n8n-workflow';
import type {
	INodeExecutionData,
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
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
	UnitTestMetaData,
} from './GenericFunctions';

export class UnitTest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unit Test',
		name: 'unitTest',
		icon: 'fa:tasks',
		group: ['input'],
		version: 1,
		description: 'Runs a specific unit test to test logic or your API endpoints',
		eventTriggerDescription: '',
		subtitle: '= ID: {{ $parameter["testId"] }}',
		defaults: {
			name: 'Unit Test Evaluation',
			color: '#b0b0b0',
		},
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		inputs: `={{(${nodeInputs})($parameter)}}`,
		requiredInputs: [0, 1],
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
		const evaluationType = this.getNodeParameter('operation', 0) as string;

		// mutable var for test pass/fail
		let pass = false;

		// output lists
		const failedArray: INodeExecutionData[] = [];
		const cleanUpArray: INodeExecutionData[] = [];

		if (evaluationType === 'comparisonEvaluation') {
			const items = this.getInputData();
			let item: INodeExecutionData;

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					// set val of item for better readability
					item = items[itemIndex];

					console.log(JSON.stringify(this.getParentNodes('Format First Name Test Evaluation')));

					// set throwOnFail param. is a nasty ternary to get const
					const throwOnFail = this.getNodeParameter('additionalFields', itemIndex).errorOnFail
						? this.getNodeParameter('additionalFields', itemIndex).errorOnFail
						: throwOnFailConst;

					pass = this.getNodeParameter('evaluations', itemIndex, false, {
						extractValue: true,
					}) as boolean;

					if (!pass) {
						failedArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});

						cleanUpArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});

						// throw error if set to fail
						if (throwOnFail) {
							throw new NodeOperationError(this.getNode(), 'Test Failed', {
								itemIndex,
							});
						}
					} else {
						cleanUpArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});
					}
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (error.context) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						error.context.itemIndex = itemIndex;
						throw error;
					}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		// evaluations for booleanInputComparison operation
		if (evaluationType === 'booleanInputComparison') {
			// get input data
			const passedRuns = this.getInputData(0);
			const failedRuns = this.getInputData(1);

			const items: INodeExecutionData[] = [];
			let item: INodeExecutionData;

			passedRuns.map((run) => {
				items.push({
					json: {
						...run.json,
						_unitTest: {
							...((run.json._unitTest || {}) as object),
							pass: true,
						},
					},
				});
			});

			failedRuns.map((run) => {
				items.push({
					json: {
						...run.json,
						_unitTest: {
							...((run.json._unitTest || {}) as object),
							pass: false,
						},
					},
				});
			});

			for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
				try {
					item = items[itemIndex];

					// set throwOnFail param. is a nasty ternary to get const
					const throwOnFail = this.getNodeParameter('additionalFields', itemIndex).errorOnFail
						? this.getNodeParameter('additionalFields', itemIndex).errorOnFail
						: throwOnFailConst;

					pass = (item.json._unitTest as UnitTestMetaData).pass as boolean;

					if (!pass) {
						failedArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});

						cleanUpArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});

						// throw error if set to fail
						if (throwOnFail) {
							throw new NodeOperationError(this.getNode(), 'Test Failed', {
								itemIndex,
							});
						}
					} else {
						cleanUpArray.push({
							json: { ...item.json, unitTestPass: pass ? 'true' : 'false' },
						});
					}
				} catch (error) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (error.context) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
						error.context.itemIndex = itemIndex;
						throw error;
					}
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
			outputBranches.find((branch) => branch.displayName === 'Clean Up') !== undefined;
		const onFailExists =
			outputBranches.find((branch) => branch.displayName === 'On Fail') !== undefined;

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

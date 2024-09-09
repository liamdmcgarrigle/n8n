import { error } from 'alasql';
import { color } from 'minifaker';
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
	NodeHelpers,
} from 'n8n-workflow';

export const nodeInputs = (parameters: INodeParameters) => {
	// get the current parameter `operation` from the node
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

export const throwOnFailConst: boolean = false;

// set default view values for `isCleanUpBranchEnabled` and `isFailBranchEnabled`
// these values are used in the `nodeOutputs` function below as well as in the node config
export const cleanUpBranchDefault: boolean = false;
export const failBranchDefault: boolean = true;

export const nodeOutputs = (
	parameters: INodeParameters,
	cleanUpBranchDefault: boolean,
	failBranchDefault: boolean,
) => {
	// due to the way the n8n node build system works, the `cleanUpBranchDefault`
	// 	and `failBranchDefault` values had to be passed in as params.

	// save params from node to vars for better readability
	// not cast because both fields are hidden by default which returns undefined.
	// 	js will turn the undefined to false (🙄), so no cast
	const cleanUpBranchInput = (parameters.additionalFields as IDataObject)?.isCleanUpBranchEnabled; // will be typeof undefined by default since the field is hidden
	const failBranchInput = (parameters.additionalFields as IDataObject)?.isFailBranchEnabled; // will be typeof undefined by default since the field is hidden

	// checks if the values are undefined and sets to default values if they are
	const isCleanUpBranchEnabled =
		cleanUpBranchInput !== undefined ? cleanUpBranchInput : cleanUpBranchDefault;
	const isFailBranchEnabled = failBranchInput !== undefined ? failBranchInput : failBranchDefault;

	// creates array to return
	let outputBranchArray = [];

	// adds cleanup branch if user has it enabled
	if (isCleanUpBranchEnabled) {
		outputBranchArray.push({
			type: `${NodeConnectionType.Main}`,
			displayName: 'Clean Up',
		});
	}

	// adds on fail branch if user has it enabled
	if (isFailBranchEnabled) {
		outputBranchArray.push({
			type: `${NodeConnectionType.Main}`,
			displayName: 'On Fail',
			category: 'error',
		});
	}

	return outputBranchArray;
};

export type RawKeyValueInputItems = {
	testRun: {
		keyValueData: Array<{ key: string; value: string }>;
	};
};

export interface RawJsonInput {
	jsonTestRun: string;
}

export interface MockNodeInput {
	mockNodeIndex: number;
	nodeName: string;
	jsonContent: string;
}

export type TriggerReturnData = {
	json: {
		[key: string]: string | ComplexJsonData;
	};
};

type ComplexJsonData = {
	binary: Record<string, unknown>;
	data: Record<string, string>;
};

export interface TestTriggerParameters {
	testId: string;
	notice: string;
	testData: {
		testDataKeyValueGroups: RawKeyValueInputItems[];
	};
	jsonTestData: {
		jsonData: RawJsonInput[];
	};
	mockNodes: {
		[key: string]: MockNodeInput[];
	};
}

export function getReturnNodeJsonFromKeyValue(
	rawKeyValueData: RawKeyValueInputItems[],
): TriggerReturnData[] {
	//return nothing if there is no input
	if (rawKeyValueData === undefined) {
		return [];
	}

	return rawKeyValueData.map((item) => {
		const jsonObject: { [key: string]: string } = {};
		if (Object.keys(item.testRun).length === 0) {
			return { json: {} };
		}
		item.testRun.keyValueData.forEach(({ key, value }) => {
			jsonObject[key] = value;
		});
		return { json: jsonObject };
	});
}

export function getReturnNodeJsonFromJson(rawJsonInputData: RawJsonInput[]): TriggerReturnData[] {
	//return nothing if there is no input
	if (rawJsonInputData === undefined) {
		return [];
	}

	return rawJsonInputData.map((item) => {
		const parsedJson = JSON.parse(item.jsonTestRun);
		return { json: parsedJson };
	});
}

// TODO: Replace the functions above with the one below
// dont actually replace them, just use those as private inside of this one
export function prepareTestData(nodeParams: MockNodeInput): INodeExecutionData[] {
	const returnData: INodeExecutionData[] = [];

	return returnData;
}

export function getNodeInputsData(this: IExecuteFunctions) {
	const returnData: INodeExecutionData[][] = [];

	const inputs = NodeHelpers.getConnectionTypes(this.getNodeInputs()).filter(
		(type) => type === NodeConnectionType.Main,
	);

	for (let i = 0; i < inputs.length; i++) {
		try {
			returnData.push(this.getInputData(i) ?? []);
		} catch (error) {
			returnData.push([]);
		}
	}

	return returnData;
}

export function triggerWithMatchingIdRan(node: IExecuteFunctions, testId: string) {
	// return node.getExecuteData(); // returns execution data of current node including params, node type, data, and more
	// return await node.getInputConnectionData(NodeConnectionType.Main, 0); // returns data from previous node, but i kept getting the error 'Node does not have a `supplyData` method defined'
	// return node.getInputSourceData(0); // returns the name of the node that connects
	// return node.getKnownNodeTypes(); // returns a list of all of the node types
	// return node.getParentNodes('Unit Test Trigger'); // kept outputting empty array
	// return node.getWorkflow(); // returns simple metadata of the workflow
	// return node.getWorkflowDataProxy(0);
	// return node.getMode(); // gets the execution mode, which in this case without modification is 'manual'
	return node.getChildNodes('Unit Test Evaluation'); // gets the execution mode, which in this case without modification is 'manual'
}

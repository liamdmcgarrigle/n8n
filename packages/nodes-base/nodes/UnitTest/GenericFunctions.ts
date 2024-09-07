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
		});
	}

	return outputBranchArray;
};

export type RawKeyValueInputItems = {
	testRun: {
		keyValueData: Array<{ key: string; value: string }>;
	};
};

export type ReturnNodeJson = {
	json: {
		[key: string]: string;
	};
};

export interface RawJsonInput {
	jsonTestRun: string;
}

export function getReturnNodeJsonFromKeyValue(
	rawKeyValueData: RawKeyValueInputItems[],
): ReturnNodeJson[] {
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

export function getReturnNodeJsonFromJson(rawJsonInputData: RawJsonInput[]): ReturnNodeJson[] {
	//return nothing if there is no input
	if (rawJsonInputData === undefined) {
		return [];
	}

	return rawJsonInputData.map((item) => {
		const parsedJson = JSON.parse(item.jsonTestRun);
		return { json: parsedJson };
	});
}

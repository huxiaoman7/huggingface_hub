import type { PipelineType, ModelData } from "../interfaces/Types";
import { getModelInputSnippet } from "./inputs";

export const bodyZeroShotClassification = (model: ModelData): string =>
	`output = query({
    "inputs": ${getModelInputSnippet(model)},
    "parameters": {"candidate_labels": ["refund", "legal", "faq"]},
})`;

export const bodyBasic = (model: ModelData): string =>
	`output = query({
	"inputs": ${getModelInputSnippet(model)},
})`;

export const pythonSnippetBodies:
	Partial<Record<keyof typeof PipelineType, (model: ModelData) => string>> =
{
	"zero-shot-classification": bodyZeroShotClassification,
	"translation":              bodyBasic,
	"summarization":            bodyBasic,
	"conversational":           bodyBasic,
	"table-question-answering": bodyBasic,
	"question-answering":       bodyBasic,
	"text-classification":      bodyBasic,
	"token-classification":     bodyBasic,
	"text-generation":          bodyBasic,
	"text2text-generation":     bodyBasic,
	"fill-mask":                bodyBasic,
	"sentence-similarity":      bodyBasic,
	"feature-extraction":       bodyBasic,
};

export function getPythonInferenceSnippet(model: ModelData, accessToken: string): string {
	const body = model.pipeline_tag && model.pipeline_tag in pythonSnippetBodies
		? pythonSnippetBodies[model.pipeline_tag]?.(model) ?? ""
		: "";

	return `import requests

API_URL = "https://api-inference.huggingface.co/models/${model.id, accessToken}"
headers = {"Authorization": ${accessToken ? `"Bearer ${accessToken}"` : `f"Bearer {API_TOKEN}"`}}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.json()

${body}`;
}

export function hasPythonInferenceSnippet(model: ModelData): boolean {
	return !!model.pipeline_tag && model.pipeline_tag in pythonSnippetBodies;
}
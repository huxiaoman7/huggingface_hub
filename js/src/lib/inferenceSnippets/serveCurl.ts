import type { PipelineType, ModelData } from "../interfaces/Types";
import { getModelInputSnippet } from "./inputs";

export const bodyBasic = (model: ModelData): string =>
	`-d '{"inputs": ${getModelInputSnippet(model, true)}}'`;

export const bodyZeroShotClassification = (model: ModelData): string =>
	`-d '{"inputs": ${getModelInputSnippet(model, true)}, "parameters": {"candidate_labels": ["refund", "legal", "faq"]}}'`;

export const curlSnippetBodies:
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

export function getCurlInferenceSnippet(model: ModelData, accessToken: string): string {
	const body = model.pipeline_tag && model.pipeline_tag in curlSnippetBodies
		? curlSnippetBodies[model.pipeline_tag]?.(model) ?? ""
		: "";
		
	return `curl https://api-inference.huggingface.co/models/${model.id} \\
	-X POST \\
	${body} \\
	-H "Authorization: Bearer ${accessToken}"
`;
}

export function hasCurlInferenceSnippet(model: ModelData): boolean {
	return !!model.pipeline_tag && model.pipeline_tag in curlSnippetBodies;
}
"use client";

import {NextPage} from "next";
import {useState} from "react";

interface ISpellingCorrectionSuggestions {
    "replacement_substring": string,
    "replacement_substring_char_end": number,
    "replacement_substring_char_start": number,
    "probability": number
}

interface ISpellingCorrectionContentResponse {
    "original_substring": string,
    "original_substring_char_end": number,
    "original_substring_char_start": number,
    suggestions: ISpellingCorrectionSuggestions[]

}

interface ISpellingCheckResponse {
    fixed: string;
    text: string;
    contentToReplace: ISpellingCorrectionContentResponse[]

}

const EXAMPLES = [
    "thies is a bery long text, do u bliebe me?",
    "thies is a beryyyy long text, do u bliebe me",
    "thies is a bery longggg text, do u bliebe me?"
]


const SpellingCorrectionPage: NextPage = () => {
    const [text, setText] = useState('thies is a bery long text, do u bliebe me ?');

    const result: ISpellingCheckResponse = text ? {
        fixed: "This is a very long text. Do you believe me?",
        text: "thies is a bery long text, do u bliebe me ?",
        contentToReplace: [
            {
                "original_substring": "thies",
                "original_substring_char_end": 4,
                "original_substring_char_start": 0,
                suggestions: [
                    {
                        "replacement_substring": "This",
                        "replacement_substring_char_end": 3,
                        "replacement_substring_char_start": 0,
                        "probability": 0.01
                    }
                ],
            },
            {
                "original_substring": "bery",
                "original_substring_char_end": 14,
                "original_substring_char_start": 11,
                suggestions: [
                    {
                        "replacement_substring": "very",
                        "replacement_substring_char_end": 13,
                        "replacement_substring_char_start": 10,
                        "probability": 0.02
                    }
                ],
            },
            {
                "original_substring": "bliebe",
                "original_substring_char_end": 37,
                "original_substring_char_start": 32,
                suggestions: [
                    {
                        "replacement_substring": "believe",
                        "replacement_substring_char_end": 39,
                        "replacement_substring_char_start": 33,
                        "probability": 0.06
                    }
                ],

            }
        ]
    } : {
        fixed: "",
        text: "",
        contentToReplace: [],
    }


    return <div className="flex gap-6 h-svh p-[12px]">
        <div className="w-full h-5/6">
            <h1>Spelling Correction system</h1>
            <textarea
                contentEditable={true}
                spellCheck={false}
                onChange={({target: {value}}) => setText(value)}
                className="w-full h-5/6 p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h2 className="mt-2">Examples:</h2>
            <div
                className="flex gap-1 mt-1.5"
            >
                {EXAMPLES.map((example) => <p
                    key={example} className="cursor-pointer p-2 w-fit rounded bg-white dark:bg-gray-800"
                    onClick={() => setText(example)}>
                    {example}
                </p>)}
            </div>
        </div>
        <div className="w-[500px]">
            <h1>Suggestions</h1>
            {result ? <div className="mt-4">
                <div className="mb-4 p-4 border border-gray-300 rounded-lg ">
                    <s>{result.text}</s>
                    <p>{result.fixed}</p>
                </div>
                <h1>Errors</h1>
                <div className="mt-4 flex flex-col gap-2">
                    {result?.contentToReplace?.map(({original_substring, suggestions}) => {
                        const [best_candidate] = suggestions;

                        return <div key={original_substring}
                                    className="w-full cursor-pointer p-2 rounded bg-white dark:bg-gray-800"
                        >
                            <s>{original_substring}</s>
                            <span>{best_candidate.replacement_substring}</span>
                            <span className="float-end">{best_candidate.probability * 100}%</span>

                            <hr className="mt-2 mb-2"/>
                            <p>Candidates:</p>
                            {suggestions.map(({replacement_substring, probability}) =>
                                <div
                                    key={replacement_substring}
                                    className="bg-white dark:bg-gray-500 p-1 mt-1 mb-1 rounded flex justify-between w-full">
                                    <b>{replacement_substring}</b>
                                    <p>{probability * 100}%</p>
                                </div>)}
                        </div>
                    })
                    }
                </div>
            </div> : <div className="mt-4">No Suggestion yet.</div>}
        </div>
    </div>
}

export default SpellingCorrectionPage;
"use client";

import {NextPage} from "next";
import {useEffect, useState} from "react";

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
    "All amimo acids at the anchor positions other than the permissible ones were assigned low scores to exclude petides with non-permisible amimo acids from the list of predicted binders. The final binding scores were normalised to a scale of 1–9 and the final models were tested and validated rigorous.",
    "Eighteen participants revealed that they shared information from the Extranet with others outside of the comitee. The information they shared most often included provincial directives and local informasion such as Hamilton medical advisors and Steering Committee minutes",
    "It was assumed that two test sequence could be distinguished if one of them contained a sub-sequence and the other did not, even if the second contaned a sub-sequence that differed from one in the first at only on position, as hybridisation methods to distinguish such sequences are well established for the assay of single nucletide polymorphis"
]


const SpellingCorrectionPage: NextPage = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<ISpellingCheckResponse>(
        {
            fixed: "",
            text: "",
            contentToReplace: [],
        }
    );

    useEffect(() => {
        // Set a timeout to update debounced value after 500ms
        const handler = setTimeout(async () => {
            const result = await fetch('api/spelling-check',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(text)
                }
            );

            const responseData = await result.json() as { data: ISpellingCheckResponse };

            setResult(responseData.data);
        }, 500);

        // Cleanup the timeout if `query` changes before 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [text])

    return <div className="flex gap-6 h-svh p-[12px]">
        <div className="w-full h-5/6">
            <h1>Spelling Correction system</h1>
            <textarea
                value={text}
                contentEditable={true}
                spellCheck={false}
                onChange={({target: {value}}) => setText(value)}
                className="w-full h-5/6 p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h2 className="mt-2">Examples:</h2>
            <div
                className="flex gap-2 mt-1.5"
            >
                {EXAMPLES.map((example) => <p
                    key={example} className="cursor-pointer p-2 w-fit rounded bg-white dark:bg-gray-800"
                    onClick={() => {
                        setText(example)
                    }}>
                    {example}
                </p>)}
            </div>
        </div>
        <div className="w-[500px]">
            <h1>Suggestions</h1>
            {result && text ? <div className="mt-4">
                <div className="mb-4 p-4 border border-gray-300 rounded-lg ">
                    {result.text !== result.fixed ?
                        <>
                            <s>{result.text}</s>
                            <p>{result.fixed}</p>
                        </> :
                        <>Looks good to me 😁</>
                    }
                </div>
                {result?.contentToReplace.length > 0 ? <>
                    <h1>Errors</h1>
                    <div className="mt-4 flex flex-col gap-2">
                        {result?.contentToReplace?.map(({original_substring, suggestions}) => {
                            const [best_candidate] = suggestions;

                            return <div key={original_substring}
                                        className="w-full cursor-pointer p-2 rounded bg-white dark:bg-gray-800"
                            >
                                <s>{original_substring}</s>
                                <span>{best_candidate.replacement_substring}</span>
                                <span className="float-end">{(best_candidate.probability * 100).toFixed(8)}%</span>

                                <hr className="mt-2 mb-2"/>
                                <p>Candidates:</p>
                                {suggestions.map(({replacement_substring, probability}) =>
                                    <div
                                        key={replacement_substring}
                                        className="bg-white dark:bg-gray-500 p-1 mt-1 mb-1 rounded flex justify-between w-full">
                                        <b>{replacement_substring}</b>
                                        <p>{(probability * 100).toFixed(8)}%</p>
                                    </div>)}
                            </div>
                        })
                        }
                    </div>
                </> : <>No error found 🤔</>}
            </div> : <div className="mt-4">No Suggestion yet.</div>}
        </div>
    </div>
}

export default SpellingCorrectionPage;
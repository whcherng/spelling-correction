"use client";

import {NextPage} from "next";
import React, {useEffect, useState} from "react";
import AccordionItem from "@/components/Accordion";

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

interface ISpellingCorrectionSelection {
    "replacement_substring": string,
    "replacement_substring_char_end": number,
    "replacement_substring_char_start": number,
    "original_substring": string,
    "original_substring_char_end": number,
    "original_substring_char_start": number,
    isOpen: boolean;
}

const EXAMPLES = [
    "All amimo acids at the anchor positions other than the permissible ones were assigned low scores to exclude petides with non-permisible amimo acids from the list of predicted binders. The final binding scores were normalised to a scale of 1–9 and the final models were tested and validated rigorous.",
    "Eighteen participants revealed that they shared information from the Extranet with others outside of the comitee. The information they shared most often included provincial directives and local informasion such as Hamilton medical advisors and Steering Committee minutes",
    "It was assumed that two test sequence could be distinguished if one of them contained a sub-sequence and the other did not, even if the second contaned a sub-sequence that differed from one in the first at only on position, as hybridisation methods to distinguish such sequences are well established for the assay of single nucletide polymorphis"
]


const SpellingCorrectionPage: NextPage = () => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ISpellingCheckResponse>(
        {
            fixed: "",
            text: "",
            contentToReplace: [],
        }
    );
    const [selection, setSelection] = useState<ISpellingCorrectionSelection[]>([])

    const changeSelection = (original_substring: string, original_substring_char_start: number, original_substring_char_end: number, original_substring_index: number, index: number) => {
        if (index === -1) {
            setSelection(prevState => prevState.map((prevData, currentIndex) => {
                if (currentIndex !== original_substring_index) {
                    return prevData;
                }

                const {isOpen} = prevData;

                return {
                    isOpen,
                    original_substring,
                    original_substring_char_start,
                    original_substring_char_end,
                    replacement_substring_char_start: original_substring_char_start,
                    replacement_substring_char_end: original_substring_char_end,
                    replacement_substring: original_substring
                };
            }))
        } else {
            setSelection(prevState => prevState.map((prevData, currentIndex) => {
                if (currentIndex !== original_substring_index) {
                    return prevData;
                }

                const {isOpen} = prevData;


                const {
                    replacement_substring,
                    replacement_substring_char_end,
                    replacement_substring_char_start
                } = result?.contentToReplace[original_substring_index].suggestions[index];

                return {
                    isOpen,
                    original_substring,
                    original_substring_char_start,
                    original_substring_char_end,
                    replacement_substring_char_start,
                    replacement_substring_char_end,
                    replacement_substring
                };
            }))

        }
    }

    const applyCorrections = () => {
        const processedText = text.split('');
        let deleteCounter = 0;

        selection?.forEach(({
                                original_substring_char_start,
                                original_substring_char_end,
                                replacement_substring
                            }) => {
            const deleteCount = original_substring_char_end + 1 - original_substring_char_start;
            processedText.splice(original_substring_char_start - deleteCounter, deleteCount, replacement_substring);
            deleteCounter = deleteCounter + deleteCount - 1
        });

        setText(processedText.join(''));
    };

    const renderCorrectedText = () => {
        const processedText = text.split('');
        let deleteCounter = 0;

        selection?.forEach(({
                                original_substring,
                                original_substring_char_start,
                                original_substring_char_end,
                                replacement_substring
                            }, index) => {
            const deleteCount = original_substring_char_end + 1 - original_substring_char_start;
            const replacementHTML = `<span id="highlight-${index}" class="hover:bg-amber-300 cursor-pointer"><span class='line-through text-red-500'>${original_substring}</span><span class='text-green-600'>${replacement_substring}</span></span>`;
            processedText.splice(original_substring_char_start - deleteCounter, deleteCount, replacementHTML);
            deleteCounter = deleteCounter + deleteCount - 1
        });

        return processedText.join('');
    };

    const outputText = renderCorrectedText()

    useEffect(() => {
        // Set a timeout to update debounced value after 500ms
        const handler = setTimeout(async () => {
            setLoading(true);

            try {
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
            } finally {
                setLoading(false)
            }
        }, 500);

        // Cleanup the timeout if `query` changes before 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [text])

    useEffect(() => {
        setSelection(result?.contentToReplace?.map(({
                                                        original_substring,
                                                        original_substring_char_start,
                                                        original_substring_char_end,
                                                        suggestions
                                                    }) => ({
            isOpen: false,
            original_substring,
            original_substring_char_start,
            original_substring_char_end,
            replacement_substring_char_start: suggestions[0].replacement_substring_char_start,
            replacement_substring_char_end: suggestions[0].replacement_substring_char_end,
            replacement_substring: suggestions[0].replacement_substring,
        })) || []);
    }, [result]);

    useEffect(() => {
        const highlightHandler: (() => void)[] = [];
        selection?.forEach((_, index) => {
            const handleHighlightClicked = (index: number) => () => {
                console.log(index);

                const newSelection = selection.map((data, currentSelection) => {
                    if (index !== currentSelection) {
                        return data;
                    }

                    const {isOpen} = data;

                    return {
                        ...data,
                        isOpen: !isOpen,
                    }

                });

                setSelection(newSelection);
            };

            highlightHandler.push(handleHighlightClicked(index));

            document?.getElementById(`highlight-${index}`)?.addEventListener?.('click',
                highlightHandler[index])
        })

        return () => {
            selection?.forEach((_, index) => {
                document?.getElementById(`highlight-${index}`)?.removeEventListener?.('click',
                    highlightHandler[index])
            })
        }
    }, [outputText, selection]);

    return <div className="flex gap-6 h-svh p-[12px]">
        <div className="w-full h-5/6">
            <h1>Spelling Correction system</h1>
            <textarea
                contentEditable
                spellCheck={false}
                value={text}
                onChange={({target: {value}}) => setText(value)}
                className="w-full h-5/6 p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
                className="sticky top-5">
                <h2>Output:</h2>
                {
                    loading ? <div>Loading...</div> :
                        <div className="mb-4 p-4 border border-gray-300 rounded-lg sticky top-5"
                             dangerouslySetInnerHTML={{__html: outputText}}/>
                }
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={applyCorrections}>
                    replace text with output
                </button>
            </div>
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
            {result && text ? <div className="mt-4">
                {result?.contentToReplace?.length > 0 ? <>
                    <h1>Errors</h1>
                    <div className="mt-4 flex flex-col gap-2">
                        {loading ?
                            <div>Loading...</div> :
                            result?.contentToReplace?.map(({
                                                               original_substring,
                                                               original_substring_char_start,
                                                               original_substring_char_end,
                                                               suggestions
                                                           }, original_substring_index) => {
                                const [best_candidate] = suggestions;

                                return <AccordionItem
                                    key={original_substring + original_substring_index}
                                    title=
                                        {<div className="flex justify-between w-full">
                                            <span>{original_substring}</span>
                                            <span
                                                className="float-end">{(best_candidate.probability * 100).toFixed(8)}%</span>
                                        </div>}
                                    isOpen={selection[original_substring_index]?.isOpen}
                                    setIsOpen={() => {
                                        setSelection((prevState) => prevState.map((data, index) => {
                                            if (index !== original_substring_index) {
                                                return data;
                                            }

                                            const {isOpen} = data;
                                            return {...data, isOpen: !isOpen}
                                        }))
                                    }}
                                    candidates={
                                        [...suggestions.map((suggestion, index) =>
                                            <div
                                                key={suggestion.replacement_substring}
                                                onClick={() => changeSelection(original_substring, original_substring_char_start, original_substring_char_end, original_substring_index, index)}
                                                className="cursor-pointer bg-white dark:bg-gray-500 hover:bg-gray-400 p-1 mt-1 mb-1 rounded flex justify-between w-full">
                                                <b>{suggestion.replacement_substring}</b>
                                                <p>{(suggestion.probability * 100).toFixed(8)}%</p>
                                            </div>),
                                            <div
                                                key="original-text"
                                                onClick={() => changeSelection(original_substring, original_substring_char_start, original_substring_char_end, original_substring_index, -1)}
                                                className="cursor-pointer bg-white dark:bg-gray-500 hover:bg-gray-400 p-1 mt-1 mb-1 rounded flex justify-between w-full"
                                            >
                                                <b>{original_substring}</b>
                                                <p>-</p>
                                            </div>
                                        ]}
                                />
                            })
                        }
                    </div>
                </> : <>No error found 🤔</>}
            </div> : <div className="mt-4">No Suggestion yet.</div>}
        </div>
    </div>
}

export default SpellingCorrectionPage;
"use client";

import {NextPage} from "next";
import {useEffect, useState} from "react";

interface ISentimentContentResponse {
    prediction?: {
        score?: number;
        sentiment?: number;
    }
}

const SentimentAnalysisPage: NextPage = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState<ISentimentContentResponse>();
    const [seed, setSeed] = useState(Math.floor(Math.random() * 7));

    useEffect(() => {
        // Set a timeout to update debounced value after 500ms
        const handler = setTimeout(async () => {
            const result = await fetch('api/sentiment-analysis',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(text)
                }
            );

            const responseData = await result.json() as { data: ISentimentContentResponse };

            setResult(responseData.data);
            setSeed(Math.floor(Math.random() * 7));
        }, 500);

        // Cleanup the timeout if `query` changes before 500ms
        return () => {
            clearTimeout(handler);
        };
    }, [text])

    return <div className="flex gap-6 h-svh p-[12px]">
        <div className="w-full">
            <h1>Movie Review Sentiment Analysis</h1>
            <textarea
                value={text}
                contentEditable={true}
                spellCheck={false}
                onChange={({target: {value}}) => setText(value)}
                className="w-full h-5/6 p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="w-[500px]">
            <h1>Result of Analysis</h1>
            <div className="h-full w-full flex justify-center align-middle flex-col">
                {
                    result?.prediction ?
                        <div className="text-center">
                            <p className="text-9xl">
                                {result?.prediction?.sentiment === 1 ? ['😏', '😊', '🤩', '😄', '😄', '😃', '🤗'][seed] : ['😅', '🤨', '😤', '😒', '😔', '😟', '😡'][seed]}
                            </p>
                            <p>Decision Function Score: {result?.prediction?.score}</p>
                        </div>
                        : 'No analysis yet'
                }
            </div>
        </div>
    </div>
}

export default SentimentAnalysisPage;
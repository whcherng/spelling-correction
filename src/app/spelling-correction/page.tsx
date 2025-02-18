import {NextPage} from "next";

const SpellingCorrectionPage: NextPage = () => {
    return (
        <div className="flex gap-6 h-svh p-[12px]">
            <div className="w-full h-full">
                <h1>Spelling Correction system</h1>
                <textarea
                    className="w-full h-5/6 p-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your text here..."
                />
            </div>
            <div className="w-[400px]">
                <h1>Assistant tab</h1>
            </div>
        </div>);
}

export default SpellingCorrectionPage;
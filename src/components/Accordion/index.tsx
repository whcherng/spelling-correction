import {FC, ReactNode} from "react";

interface IAccordionItemProps {
    title: ReactNode;
    candidates: ReactNode;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const AccordionItem: FC<IAccordionItemProps> = ({title, candidates, isOpen, setIsOpen}) => {

    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                className="w-full flex justify-between items-center px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold w-full">{title}</span>
                <span className="text-xl ml-2">{isOpen ? "−" : "+"}</span>
            </button>

            <div
                className={`transition-all duration-300 ${
                    isOpen ? "max-h-fit opacity-100 p-4" : "max-h-0 opacity-0"
                } bg-white  dark:bg-gray-800`}
            >
                <hr/>
                {candidates}
            </div>
        </div>
    );
};

export default AccordionItem;

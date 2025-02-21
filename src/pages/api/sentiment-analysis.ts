import type {NextApiRequest, NextApiResponse} from 'next'

type RequestData = {
    text: string;
}

type ResponseData = {
    message: string;
    data?: unknown;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    if (req.method === 'POST') {
        const result = await fetch('https://green-bush-15cbfb9a9ad04500a17170a3589fe36f.azurewebsites.net/sentiment-analysis',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body)
            },
        );
        res.status(200).json({message: "OK", data: await result.json()})
    } else {
        res.status(200).json({message: 'Please pass some text in the payload, make sure it is post'})
    }
}
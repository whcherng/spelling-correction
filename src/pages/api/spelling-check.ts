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
        const result = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
        res.status(200).json({message: "OK", data: await result.json()})
    } else {
        res.status(200).json({message: 'Please pass some text in the payload, make sure it is post'})
    }
}
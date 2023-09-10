import type { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        const topics = await fetch('http://localhost/next-php-blog/server/controllers/getTopics.php', {
            method: "GET"
        })

        const body = await topics.json()

        const publicFolderPath = path.join(process.cwd(), 'public');
        const jsonFilePath = path.join(publicFolderPath, 'json', 'post_topics.json');

        fs.writeFile(jsonFilePath, JSON.stringify(body), (err) => {
            if (err) {
                console.error('Error writing to post_topics.json', err);
                res.status(500).send('Error writing to post_topics.json');
            } else {
                res.status(200).send('Synchronized ' + JSON.stringify(body));
            }
        })


    } catch (e){
        res.status(500).send('Error writing to post_topics.json');
    }
    
}
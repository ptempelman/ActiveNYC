
export async function retrain() {
    const url = process.env.ML_API_ENDPOINT + "/retrain";

    if (!url) {
        throw new Error("ML_API_ENDPOINT not found");
    }

    console.log("Full URL:", url);

    interface ResultType {
        [key: string]: number;
    }

    let result: ResultType | null = null;

    try {
        const response = await fetch(url, {
            method: 'GET',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseJson = await response.json();
        result = responseJson as ResultType;
    } catch (error) {
        console.error("Error calling FastAPI endpoint:", error);
        throw new Error('Error calling FastAPI endpoint:');
    }
}

import * as React from 'react';
import TaskPage from "@/components/pages/taskPage";


type PropsType = {
    params: Promise<{ slug: string }>;
};

const Task: React.FunctionComponent<PropsType> = async ({ params }) => {
    const { slug: token } = await params;

    return (
        <TaskPage taskToken={token} />
    )
}

export default Task;
